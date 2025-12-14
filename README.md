# Sweet Shop Management System

A full-stack TDD application for managing a sweet shop inventory with user authentication, role-based access control, and comprehensive CRUD operations.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest with Supertest
- **Validation**: Zod

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with responsive design

## Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── app.ts                # Express app setup
│   │   ├── prisma.ts             # Prisma client instance
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── middleware/
│   │   │   └── auth.ts           # JWT authentication & role guards
│   │   ├── routes/
│   │   │   ├── authRoutes.ts     # Auth endpoints
│   │   │   └── sweetRoutes.ts    # Sweet CRUD endpoints
│   │   └── services/
│   │       ├── authService.ts    # Auth business logic
│   │       └── sweetService.ts   # Sweet business logic
│   ├── tests/
│   │   ├── setup.ts              # Test environment setup
│   │   ├── auth.test.ts          # Auth endpoint tests
│   │   └── sweets.test.ts        # Sweet endpoint tests
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema
│   │   └── migrations/           # Database migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React entry point
│   │   ├── App.tsx               # Main app with routing
│   │   ├── api.ts                # API client & types
│   │   ├── AuthContext.tsx       # Authentication context
│   │   └── pages/
│   │       ├── AuthPage.tsx      # Login/Register page
│   │       └── Dashboard.tsx     # Main dashboard
│   └── package.json
└── README.md
```

## Features

### Authentication & Authorization
- User registration and login with email/password
- JWT-based token authentication
- Role-based access control (USER/ADMIN)
- Secure password hashing with bcrypt

### Sweet Management (All Users)
- View all available sweets
- Search sweets by name, category, or price range
- Purchase sweets (decreases quantity)
- Real-time stock availability

### Admin Features
- Add new sweets
- Update sweet details
- Delete sweets
- Restock inventory

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### Sweets (Protected)
```
GET    /api/sweets              - List all sweets
GET    /api/sweets/search       - Search sweets (query params: name, category, minPrice, maxPrice)
POST   /api/sweets              - Add new sweet
PUT    /api/sweets/:id          - Update sweet
DELETE /api/sweets/:id          - Delete sweet (Admin only)
POST   /api/sweets/:id/purchase - Purchase sweet
POST   /api/sweets/:id/restock  - Restock sweet (Admin only)
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`.env` file already created):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="change-me"
```

4. Run database migration:
```bash
npm run prisma:migrate
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Start development server:
```bash
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Running Tests

Backend tests (TDD with Jest):
```bash
cd backend
npm test
```

## Test Coverage

All backend features are fully tested with comprehensive test suites:

- **Auth Tests**: Registration, login, duplicate prevention, invalid credentials
- **Sweet Tests**: CRUD operations, search/filter, purchase logic, admin-only operations, stock validation

Test results show 10 passing tests with coverage of all core business logic.

## Database Schema

### User
- id: Int (Primary Key)
- email: String (Unique)
- passwordHash: String
- role: String (USER/ADMIN)
- createdAt: DateTime

### Sweet
- id: Int (Primary Key)
- name: String (Unique)
- category: String
- price: Decimal
- quantity: Int
- createdAt: DateTime
- updatedAt: DateTime

## TDD Approach

This project follows strict Test-Driven Development:

1. **RED**: Write failing tests first
2. **GREEN**: Implement minimum code to pass tests
3. **REFACTOR**: Clean up and optimize code

All backend logic was developed using TDD methodology, visible in commit history with clear test-first patterns.

## My AI Usage

### AI Tools Used
- **GitHub Copilot** (VS Code Extension)

### How I Used AI

#### Code Generation (40%)
- AI assisted in generating boilerplate code for:
  - Express route handlers with consistent error handling patterns
  - Prisma schema definitions and model relationships
  - Jest test suite templates and test case structures
  - React component scaffolding with TypeScript types
  - CSS styling patterns for consistent UI appearance

#### Problem Solving (30%)
- AI helped debug and resolve:
  - Prisma client version compatibility issues (v7 → v5 downgrade)
  - TypeScript typing errors with JWT and Prisma Decimal types
  - SQLite enum limitation workarounds (enum → string with Role type)
  - React Router v6 authentication flow patterns
  - CORS and proxy configuration for frontend-backend communication

#### Best Practices & Architecture (20%)
- AI provided guidance on:
  - RESTful API endpoint naming conventions
  - JWT authentication middleware patterns
  - Role-based authorization implementation
  - React Context API for auth state management
  - Test organization and separation of concerns

#### Documentation (10%)
- AI assisted with:
  - README structure and content organization
  - API endpoint documentation formatting
  - Code comments for complex business logic
  - Git commit message templates

### My Reflection on AI Impact

**Productivity Gains**: AI accelerated development by ~60%, particularly in:
- Eliminating context-switching for syntax lookups
- Rapid prototyping of component structures
- Quick resolution of type errors and compatibility issues

**Learning Opportunities**: While AI suggested solutions, I:
- Reviewed and understood every line of generated code
- Modified AI suggestions to fit project architecture
- Made conscious decisions about which suggestions to accept/reject
- Learned Prisma v5/v7 differences through debugging AI-generated code

**Critical Thinking**: AI required careful oversight:
- Some suggestions used outdated patterns (e.g., Prisma v7 adapter requirements)
- Type assertions needed manual review for correctness
- Test cases required manual verification of edge cases
- Security considerations (e.g., password hashing) needed manual validation

**Code Ownership**: Despite AI assistance, I:
- Architected the overall system structure
- Made all final decisions on implementation approaches
- Manually debugged complex integration issues
- Ensured test coverage aligned with TDD principles

**Verdict**: AI is an invaluable pair-programming tool that dramatically improves velocity, but human judgment remains essential for architecture, security, and quality assurance.

## Screenshots

### Login Page
![Login Screenshot](./screenshots/login.png)
*Clean authentication interface with register/login toggle*

### Dashboard - User View
![Dashboard Screenshot](./screenshots/dashboard-user.png)
*Sweet shop catalog with search filters and purchase functionality*

### Dashboard - Admin View
![Admin Dashboard Screenshot](./screenshots/dashboard-admin.png)
*Full CRUD controls for inventory management, including add, edit, delete, and restock*

*(Note: Screenshots to be captured after deployment)*

## Deployment

### Backend Deployment (Optional)
Deploy to platforms like:
- Heroku
- Railway
- Render
- AWS EC2/Elastic Beanstalk

### Frontend Deployment (Optional)
Deploy to platforms like:
- Vercel
- Netlify
- GitHub Pages (with routing configuration)

## Development Workflow

1. **Version Control**: Frequent commits with descriptive messages
2. **TDD Cycle**: Write tests → Implement → Refactor
3. **AI Co-authorship**: All AI-assisted commits marked with co-author
4. **Code Review**: Self-review of AI suggestions before committing
5. **Integration Testing**: Manual end-to-end testing after feature completion

## Future Enhancements

- Order history tracking
- Shopping cart functionality
- Payment integration
- Email notifications
- Product images
- Advanced analytics dashboard
- Multi-currency support

## License

ISC

## Author

Developed as part of a TDD kata assignment demonstrating full-stack development proficiency with modern AI-assisted workflow.

---

**Assignment Submission Date**: December 14, 2025  
**Development Time**: ~12 hours (intensive sprint)  
**Test Status**: ✅ All tests passing (10/10)
