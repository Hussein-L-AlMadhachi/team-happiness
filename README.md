# Team Happiness

**Image to Text Conversion Platform**

Team Happiness is a full-stack application that leverages AI to convert images to text. It features a robust backend for managing users, uploads, and AI processing, and a modern, responsive frontend for a seamless user experience.

## 🚀 Features

-   **AI-Powered Image Analysis**: Uses the LLaVA model via Ollama to analyze images and extract textual descriptions.
-   **User Authentication**: Secure JWT-based authentication with role-based access control (Admin, User).
-   **File Management**: Upload, organize, and manage images in folders.
-   **Zero-Boilerplate RPC**: Utilizes `enders-sync` for seamless communication between frontend and backend.
-   **Responsive Design**: Built with Svelte and TailwindCSS for a beautiful mobile-first interface.

## 🛠️ Tech Stack

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL (managed by `pg-norm`)
-   **Caching/Queue**: Redis
-   **AI Inference**: Ollama (LLaVA model)
-   **RPC**: `enders-sync`

### Frontend
-   **Framework**: Svelte
-   **Build Tool**: Vite
-   **Styling**: TailwindCSS + Shadcn
-   **RPC Client**: `enders-sync-client`

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v18+ recommended)
-   [PostgreSQL](https://www.postgresql.org/)
-   [Redis](https://redis.io/)
-   [Ollama](https://ollama.com/) (with `llava` model pulled: `ollama pull llava`)

## ⚙️ Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd team-happiness
    ```

2.  **Install Dependencies**
    
    Backend:
    ```bash
    cd backend
    npm install
    ```

    Frontend:
    ```bash
    cd ../frontend
    npm install
    ```

3.  **Environment Configuration**
    
    Create a `.env` file in the `backend` directory. You can copy the example if available or set the following variables:
    ```env
    PORT=3000
    DATABASE_URL=postgres://user:password@localhost:5432/team_happiness
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your_super_secret_key
    OLLAMA_HOST=http://localhost:11434
    ```

4.  **Database Setup**
    
    Initialize the database schema:
    ```bash
    cd backend
    npm run db:create
    ```

## 🏃‍♂️ Running the Application

### Start the Backend
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:3000` (or your configured PORT).

### Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend development server will start, usually on `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
