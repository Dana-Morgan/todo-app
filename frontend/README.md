# To-Do App

## Overview
A full-stack web application for managing tasks. It features secure login with **JWT**, task management (add, edit, delete), and is built with **React** on the frontend and **Express** with **PostgreSQL** on the backend.

## Technologies Used
- **Frontend**: React, JavaScript/TypeScript
- **Backend**: Express, Node.js, PostgreSQL
- **Authentication**: JWT-based login
- **Database**: PostgreSQL

## Features
- User registration (Name, Email, Gender, Password)
- User login with email and password
- Task management (Add, Edit, Delete)
- CSRF protection

## Setup & Installation
1. Clone the repository: `git clone https://github.com/Dana-Morgan/todo-app.git`
2. Install dependencies:
   - For frontend: `npm install` (in the frontend folder)
   - For backend: `npm install` (in the backend folder)
3. Set up environment variables (e.g., database credentials, JWT secret)
4. Run the application:
   - Frontend: `npm start`
   - Backend: `npm run dev`

## Testing
- Use Postman for API testing. The collection is provided with request and response examples.

## License
MIT License