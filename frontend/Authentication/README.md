# Project Setup

## Folder Structure

```
/project-root
    /frontend
        /authentication
    /pern-auth
        /backend
            server.js
```

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## Installation

### 1. Install Dependencies

Navigate to the `frontend/Authentication` directory:

```sh
cd frontend/Authentication
npm install
```

Navigate to the `pern-auth/backend` directory:

```sh
cd ../../pern-auth/backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `pern-auth/backend` directory and set up:

```env
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_secret_key
```

## Running the Project

### Start Frontend & Backend Together

From the `frontend/authentication` directory, run:

```sh
npm run dev
```

### Dev Script (`package.json` in `frontend/authentication`)

Make sure your `package.json` contains:

```json
"scripts": {
  "dev": "concurrently \"vite\" \"nodemon ../../pern-auth/backend/server.js\""
}
```

## Backend Setup (Express & PostgreSQL)

Ensure your `server.js` contains:

```js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Notes

- Ensure PostgreSQL is running and the database URL is correctly set.
- If using authentication, configure JWT and bcrypt properly.

## Troubleshooting

- If `nodemon` or `concurrently` isn't found, install them:
  ```sh
  npm install -g nodemon concurrently
  ```
- If there's a port conflict, change Vite’s port in `vite.config.js`:
  ```js
  server: {
    port: 3000;
  }
  ```
