import express, { response, type Request, type Response } from 'express';
import multer from 'multer';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { generateRandomBase64, hashFile } from '../modules/crypto.js';

import { analyzeImage } from "../modules/llava.js";
import { isValidNoRPC } from '../modules/auth.js';
import { isRateLimited } from '../modules/rate_limit.js';


const limit = 5// Tem requests
const duration = 3600 // One hour



// database objects
import { uploads } from '../db.js';





// Create uploads directory if it doesn't exist
const uploadDir = '/home/hussein/Repos/HACKATHON-team-happiness/hackton/team-happiness/backend/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = generateRandomBase64();
        cb(null, uniqueFileName + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});



// Serve static files from uploads directory
export const setupUploadRoutes = (app: express.Application) => {
    app.use('/images', express.static(path.join(process.cwd(), uploadDir)));
    app.set('trust proxy', true);

    // Initialize multer with the storage configuration
    app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {

        const uid = isValidNoRPC(req, res);
        if (!uid) {
            res.json({
                success: false,
                is_auth: false,
                is_limited: false,
                reason: "unauthorized"
            })
            return;
        };

        // auth
        if (!req.file) {
            return res.json({
                success: false,
                reason: "no file uploaded"
            })
        }

        // rate limiting
        // NOTE: if no ip found default to account-based id limiting
        let limited;
        if (!req.ip) {
            limited = await isRateLimited(uid.toString(), limit, duration);
        } else {
            limited = await isRateLimited(req.ip, limit, duration);
        }

        if (limited) {
            return res.json({
                success: false,
                is_auth: true,
                is_limited: true,
                reason: "rate limited: return in an hour"
            })
        }
        console.log("checking cache")
        // caching
        const file_hash = await hashFile(req.file.path);
        const [file] = await uploads.filterUploadsByHash(file_hash);
        if (file) {
            console.log("cache hit")
            const response = res.json({
                success: true,
                filename: file.file_name,
                path: `${uploadDir}/${file.file_name}`,
                description: file.description
            })

            await uploads.update(file.id, { file_name: req.file.filename });
            fs.unlinkSync(`${uploadDir}/${req.file.filename}`);

            return response;
        }

        console.log("[cache miss] will generate")
        // uploading data
        const description = await analyzeImage(`${uploadDir}/${req.file.filename}`);
        console.log("generated")

        if (description === undefined) {
            return res.json({
                success: false,
                is_auth: true,
                is_limited: false,
                reason: "failed to analyze image"
            })
        }

        console.log("will insert")
        try {
            uploads.insert({
                "owner": uid,
                "file_hash": file_hash,
                "description": description,
                "file_name": `${uploadDir}/${req.file.filename}`
            });
            console.log("inserted")
        } catch (error) {
            fs.unlinkSync(`${uploadDir}/${req.file.filename}`);
            console.log(`failed insert ${error}`);

            return res.json({
                success: false,
                is_auth: true,
                is_limited: false,
                reason: "failed to process image"
            })

        }

        console.log("all done. returning response")

        res.json({
            success: true,
            filename: req.file.filename,
            path: `${uploadDir}/${req.file.filename}`,  // This should work if static serving is set up correctly
            description: description
        });


    });
}
