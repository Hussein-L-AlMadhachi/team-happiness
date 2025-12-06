import { app } from "./app.js";

import "./costum_routes/uploadImage.js";

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
