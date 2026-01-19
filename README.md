# Authentication System Backend

This is a robust **Authentication System** built with **Node.js**, **Express**, and **TypeScript**. It provides secure user authentication using **JWT**, **Passport.js (Google OAuth)**, and session management. The data is managed using **Prisma ORM** with a **PostgreSQL** database.

## 🚀 Features

-   **User Authentication**: Sign up and login with email & password.
-   **Google OAuth**: Login with Google using Passport.js.
-   **Role-Based Access Control**: Support for `USER` and `ADMIN` roles.
-   **Secure Tokens**: Uses JWT (JSON Web Tokens) for access management and Refresh Tokens for session persistence.
-   **Database**: PostgreSQL managed via Prisma.
-   **Security**: Helmet for headers, bcrypt for password hashing, and input validation with Zod.

---

## 🛠️ Prerequisites

Before running this project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (Database)


---

## ⚙️ Setup & Installation

1.  **Navigate to the project directory**:
    ```bash
    cd "Authentication-System\auth-backend"
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Ensure you have a `.env` file in the root `auth-backend` folder with the following variables (example):
    ```env
    PORT=4000
    DATABASE_URL="postgresql://user:password@localhost:5432/auth_db?schema=public"
    JWT_ACCESS_SECRET="your_super_secret_key"
    JWT_REFRESH_SECRET="your_refresh_secret_key"
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    NODE_ENV="development"
    ```

4.  **Database Migration**:
    Push the Prisma schema to your PostgreSQL database:
    ```bash
    npx prisma migrate dev
    ```

---

## ▶️ Running the Project

To start the development server with hot-reloading:

```bash
npm run dev
```

The server will start at `http://localhost:4000`.

---

## 🗄️ Checking the Database (Prisma Studio)

You can view and manage your database records directly in your browser using **Prisma Studio**. This is the easiest way to check users, tokens, and other data "using Chrome".

1.  **Run the following command in your terminal**:
    ```bash
    npx prisma studio
    ```

2.  **Open your browser**:
    It should automatically open. If not, verify the URL in the terminal (usually `http://localhost:5555`).

    From here, you can:
    -   View all `User` records.
    -   Check `RefreshToken` and `OAuthAccount` tables.
    -   Manually add, edit, or delete records for testing.

---

## 📂 Project Structure

-   `src/app.ts` - Main Express application setup.
-   `src/server.ts` - Entry point that starts the server.
-   `src/modules/` - Contains logic for Auth, Admin, etc.
-   `prisma/schema.prisma` - Database schema definition.
