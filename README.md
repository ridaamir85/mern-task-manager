# MERN Task Manager

A full-stack task manager built with MongoDB, Express, React, and Node.js. Users can create an account, log in, and manage their own private task list with complete CRUD operations.

## Features

- Register and log in with JWT authentication
- Create and save tasks in MongoDB
- Read saved tasks after refreshing or returning later
- Mark tasks complete or incomplete
- Delete tasks
- Separate task lists for every user
- Immediate UI updates after CRUD operations
- Loading, validation, API, and connection error messages
- Responsive interface for desktop and mobile

## Tech stack

- **Frontend:** React, Vite, Fetch API
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas with Mongoose
- **Authentication:** JSON Web Tokens and bcrypt
- **Deployment:** Vercel (frontend and backend)

## Project structure

```text
mern-task-manager/
|-- client/       React frontend
|-- server/       Express and MongoDB API
|-- client/       Vercel frontend project
`-- server/       Vercel backend project
```

## Run locally

### 1. Configure the backend

Copy `server/.env.example` to `server/.env` and replace the example values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Then run:

```bash
cd server
npm install
npm run dev
```

The API will run at `http://localhost:5000`.

### 2. Configure the frontend

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then run in a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose | Authentication |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in | No |
| GET | `/api/auth/profile` | Read the current profile | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| GET | `/api/tasks` | Read the user's tasks | Yes |
| GET | `/api/tasks/:id` | Read one task | Yes |
| PATCH | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

Protected endpoints require `Authorization: Bearer <token>`.

## CRUD mapping

| CRUD operation | Website action | API request |
| --- | --- | --- |
| Create | Add a new task | `POST /api/tasks` |
| Read | Display saved tasks | `GET /api/tasks` |
| Update | Toggle completed status | `PATCH /api/tasks/:id` |
| Delete | Remove a task | `DELETE /api/tasks/:id` |

## Deployment on Vercel

Import this repository twice as two Vercel projects.

### Backend project

Set the root directory to `server` and add `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` as environment variables.

### Frontend project

Set the root directory to `client` and add:

```env
VITE_API_URL=https://your-api-project.vercel.app/api
```

After the frontend deploys, update the backend project's `CLIENT_URL` with the frontend Vercel URL.
