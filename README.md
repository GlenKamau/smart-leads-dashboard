# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with React, Node.js, Express, MongoDB, and TypeScript. This project demonstrates production-ready practices suitable for a senior internship submission.

## Project Overview

Smart Leads Dashboard is a lead management system that allows sales teams to:
- Register and authenticate securely
- Manage customer leads (CRUD)
- Search and filter leads by status, source, and name/email
- Paginate through large datasets
- Export filtered results to CSV
- Role-based access control (Admin/Sales)

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Query (server state)
- React Hook Form + Zod (form validation)
- React Router DOM

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- express-validator

### DevOps
- Docker + Docker Compose

## Project Structure

```
smart-leads-dashboard
├── backend/
│   ├── src/
│   │   ├── config/          # Environment configuration
│   │   ├── constants/       # Enums and constants
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middleware/       # Auth & role middleware
│   │   ├── models/          # Mongoose models
│   │   ├── modules/
│   │   │   ├── auth/        # Auth controller, routes, validation
│   │   │   └── leads/       # Leads controller, routes, validation
│   │   ├── utils/           # JWT, response, query builder utilities
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API clients
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Route layouts
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # React entry point
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop (for containerized setup)
- MongoDB (local or cloud)

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Installation

#### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

#### Docker Setup

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Running Tests

```bash
# Backend
cd backend
npm test
```

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login and get JWT token |
| `/api/auth/profile` | GET | Get current user profile |

### Leads Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | GET | Get all leads (paginated) |
| `/api/leads` | POST | Create new lead |
| `/api/leads/:id` | GET | Get single lead |
| `/api/leads/:id` | PUT | Update lead |
| `/api/leads/:id` | DELETE | Delete lead |
| `/api/leads/export` | GET | Export leads to CSV |

### Query Parameters

All filter parameters can be combined:

```
GET /api/leads?status=New&source=Website&search=John&sort=latest&page=1&limit=10
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| status | New, Contacted, Qualified, Lost | Filter by status |
| source | Website, Instagram, Referral | Filter by source |
| search | string | Search by name or email |
| sort | latest, oldest | Sort by creation date |
| page | number | Page number (default: 1) |
| limit | number | Records per page (default: 10) |

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "data": [...],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error"
}
```

## User Roles

- **Admin**: Full access to all features
- **Sales**: Can manage own leads only

## Features

- [x] JWT-based authentication
- [x] Role-based access control
- [x] Complete CRUD for leads
- [x] Advanced filtering (status, source, search, sort)
- [x] Backend pagination
- [x] CSV export with filter support
- [x] Debounced search (500ms)
- [x] Responsive dashboard UI
- [x] Loading and error states
- [x] Form validation with Zod

## Scripts

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Docker Commands

```bash
# Start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up --build backend
```

## Screenshots

Dashboard with statistics and filters
Lead management table with pagination
Login/Register forms with validation

## License

MIT

## Author

Created as an internship technical assessment project.