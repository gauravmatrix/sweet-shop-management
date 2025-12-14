🍬 Sweet Shop Management System
https://img.shields.io/badge/Django-5.0-green.svg
https://img.shields.io/badge/React-18.2-blue.svg
https://img.shields.io/badge/PostgreSQL-15-blue.svg
https://img.shields.io/badge/License-MIT-yellow.svg

A full-stack inventory management system for sweet shops with real-time tracking, user authentication, and admin dashboard. Built with Django REST Framework backend and React frontend using Test-Driven Development (TDD) methodology.

📋 Table of Contents
Project Overview

Features

Technology Stack

Project Structure

Installation & Setup

API Documentation

Testing

AI Usage & TDD Process

Deployment

Screenshots

Contributing

License

🎯 Project Overview
Objective
Build a complete Sweet Shop Management System with:

✅ User Authentication (Register/Login with JWT)

✅ Sweet Inventory CRUD (Create, Read, Update, Delete)

✅ Purchase & Restock Operations

✅ Admin Dashboard with statistics

✅ Search & Filter functionality

✅ Responsive Frontend with modern UI

Key Requirements Met
🔐 Token-based Authentication (JWT)

🧪 Test-Driven Development (TDD with Red-Green-Refactor)

🤖 AI-Assisted Development (Transparent AI usage)

📱 Modern Frontend (React with Tailwind CSS)

🗄️ Database Integration (PostgreSQL)

📚 Comprehensive Documentation

🔍 Search & Filter capabilities

📊 Admin Dashboard with analytics

✨ Features
🎨 Frontend Features
User Authentication (Login/Register/Profile)

Sweet Listing with pagination

Advanced Search by name, category, price range

Real-time Inventory Updates

Purchase System with quantity validation

Admin Panel for inventory management

Responsive Design (Mobile & Desktop)

Toast Notifications for user feedback

Loading States & Skeletons

Dark/Light Mode ready

⚙️ Backend Features
RESTful API with Django REST Framework

JWT Authentication with refresh tokens

Role-based Permissions (Admin/User)

Database Models with proper relationships

Automated Email Notifications

API Rate Limiting

Comprehensive Error Handling

Swagger/OpenAPI Documentation

Database Migrations

Custom Admin Interface

🛡️ Security Features
Password Hashing (bcrypt)

CORS Configuration

SQL Injection Protection

XSS Protection

CSRF Protection

Environment Variables

Input Validation & Sanitization

🛠️ Technology Stack
Backend (Django)
Technology	Purpose	Version
Python	Core Language	3.11+
Django	Web Framework	5.0
Django REST Framework	API Building	3.14
PostgreSQL	Primary Database	15
JWT	Authentication	Simple JWT
CORS Headers	Cross-Origin Requests	4.3
Swagger/OpenAPI	API Documentation	drf-yasg
Pytest	Testing Framework	7.4
Frontend (React)
Technology	Purpose	Version
React	UI Library	18.2
React Router	Navigation	6.20
Axios	HTTP Client	1.6
Tailwind CSS	Styling	3.3
React Query	Data Fetching	5.12
React Hook Form	Form Handling	7.48
React Hot Toast	Notifications	2.4
Recharts	Data Visualization	2.10
Lucide React	Icons	0.309
Development Tools
Tool	Purpose
Git	Version Control
Postman	API Testing
VS Code	Code Editor
PowerShell	Command Line
pgAdmin	Database Management
📁 Project Structure
text
sweet-shop-management/
│
├── 📁 api/                          # Django API App
│   ├── 📁 migrations/              # Database migrations
│   ├── 📁 management/commands/     # Custom commands
│   ├── models.py                  # Sweet model
│   ├── views.py                   # API views
│   ├── serializers.py             # Data serializers
│   ├── urls.py                    # API routes
│   ├── tests.py                   # TDD tests
│   ├── admin.py                   # Admin customization
│   └── permissions.py             # Custom permissions
│
├── 📁 users/                       # Authentication App
│   ├── models.py                  # Custom User model
│   ├── views.py                   # Auth views
│   ├── serializers.py             # User serializers
│   ├── urls.py                    # Auth routes
│   ├── tests.py                   # Auth tests
│   └── signals.py                 # Email notifications
│
├── 📁 sweet_shop/                  # Django Project
│   ├── settings.py                # Project settings
│   ├── urls.py                    # Main URLs
│   ├── wsgi.py                    # WSGI config
│   └── asgi.py                    # ASGI config
│
├── 📁 frontend/                    # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/         # React components
│   │   │   ├── 📁 Layout/        # Layout components
│   │   │   ├── 📁 Auth/          # Auth components
│   │   │   ├── 📁 Sweets/        # Sweet components
│   │   │   ├── 📁 Common/        # Shared components
│   │   │   └── 📁 Admin/         # Admin components
│   │   │
│   │   ├── 📁 pages/              # Page components
│   │   │   ├── 📁 Home/          # Home page
│   │   │   ├── 📁 Auth/          # Auth pages
│   │   │   ├── 📁 Dashboard/     # Dashboard pages
│   │   │   ├── 📁 Sweets/        # Sweet pages
│   │   │   └── 📁 Admin/         # Admin pages
│   │   │
│   │   ├── 📁 services/           # API services
│   │   ├── 📁 contexts/           # React contexts
│   │   ├── 📁 hooks/              # Custom hooks
│   │   ├── 📁 utils/              # Utility functions
│   │   ├── 📁 styles/             # CSS files
│   │   ├── App.jsx                # Main App
│   │   └── index.jsx              # Entry point
│   │
│   ├── package.json               # Dependencies
│   ├── tailwind.config.js         # Tailwind config
│   └── .env                       # Environment variables
│
├── manage.py                      # Django management
├── requirements.txt               # Python dependencies
├── .env                          # Backend environment
└── README.md                     # This file
🚀 Installation & Setup
Prerequisites
Python 3.11+

Node.js 18+

PostgreSQL 15+

Git

Backend Setup
bash
# 1. Clone repository
git clone <repository-url>
cd sweet-shop-management

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 5. Run migrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser

# 7. Start development server
python manage.py runserver
Frontend Setup
bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:8000/api

# 4. Start development server
npm start
Database Setup
sql
-- Create PostgreSQL database
CREATE DATABASE sweet_shop_db;
CREATE USER sweet_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sweet_shop_db TO sweet_user;
📚 API Documentation
Base URL
text
http://localhost:8000/api/
Authentication Endpoints
Method	Endpoint	Description	Auth Required
POST	/auth/register/	User registration	❌ No
POST	/auth/login/	User login	❌ No
POST	/auth/refresh/	Refresh JWT token	✅ Yes
GET	/auth/profile/	User profile	✅ Yes
PUT	/auth/profile/update/	Update profile	✅ Yes
Sweet Management Endpoints
Method	Endpoint	Description	Auth Required	Admin Only
GET	/sweets/	List all sweets	✅ Yes	❌ No
POST	/sweets/	Create new sweet	✅ Yes	✅ Yes
GET	/sweets/{id}/	Get sweet details	✅ Yes	❌ No
PUT	/sweets/{id}/	Update sweet	✅ Yes	✅ Yes
DELETE	/sweets/{id}/	Delete sweet	✅ Yes	✅ Yes
POST	/sweets/{id}/purchase/	Purchase sweet	✅ Yes	❌ No
POST	/sweets/{id}/restock/	Restock sweet	✅ Yes	✅ Yes
GET	/sweets/search/	Search sweets	✅ Yes	❌ No
Filtering & Sorting
http
GET /api/sweets/?category=chocolate&min_price=50&max_price=200
GET /api/sweets/?search=dark&ordering=-price
GET /api/sweets/?available_only=true&is_featured=true
Response Format
json
{
  "count": 100,
  "next": "http://api.example.com/sweets/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Chocolate Truffle",
      "category": "chocolate",
      "price": 25.00,
      "quantity": 50,
      "is_available": true
    }
  ]
}
Access Swagger UI: http://localhost:8000/swagger/
Access ReDoc: http://localhost:8000/redoc/

🧪 Testing
Backend Tests
bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api
python manage.py test users

# Run with coverage
coverage run manage.py test
coverage report
coverage html
Frontend Tests
bash
cd frontend
npm test
TDD Workflow Followed
RED - Write failing test

GREEN - Implement minimum code to pass

REFACTOR - Improve code quality

COMMIT - With descriptive message

Test Coverage
✅ User authentication tests

✅ Sweet CRUD operations

✅ Permission tests

✅ API endpoint tests

✅ Form validation tests

✅ Edge case handling

🤖 AI Usage & TDD Process
AI Tools Used
Tool	Purpose	Usage Percentage
GitHub Copilot	Code completion, boilerplate	40%
ChatGPT	Architecture design, debugging	35%
Bard/Gemini	Documentation, API structure	25%
AI-Assisted Tasks
Initial Setup - Project structure, configuration files

Boilerplate Code - Models, serializers, views templates

Test Generation - TDD test cases

Error Debugging - Troubleshooting complex issues

Documentation - README, code comments

UI Components - React component structure

Commit Convention with AI Co-authors
bash
git commit -m "feat: Implement user authentication endpoint

- Added JWT token generation
- Implemented password validation
- Added error handling for invalid credentials

Co-authored-by: GitHub Copilot <copilot@github.com>
Co-authored-by: ChatGPT <chatgpt@openai.com>"
Transparency & Ethics
All AI-generated code reviewed and validated

Proper attribution in commits

Manual testing of AI-suggested solutions

Security review of AI-generated authentication code

🌐 Deployment
Backend Deployment (Production)
bash
# 1. Set production settings
DEBUG=False
ALLOWED_HOSTS=['your-domain.com']
SECURE_SSL_REDIRECT=True

# 2. Collect static files
python manage.py collectstatic

# 3. Using Gunicorn
gunicorn sweet_shop.wsgi:application --workers 4 --bind 0.0.0.0:8000

# 4. Using Daphne (ASGI)
daphne sweet_shop.asgi:application --bind 0.0.0.0 --port 8000
Frontend Deployment
bash
# 1. Build for production
cd frontend
npm run build

# 2. Deploy to Vercel
vercel --prod

# 3. Or deploy to Netlify
netlify deploy --prod
Environment Variables (Production)
env
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com

# Frontend
REACT_APP_API_URL=https://api.your-domain.com/api
REACT_APP_ENV=production
📸 Screenshots
Login Page
https://via.placeholder.com/800x400/FF6B8B/FFFFFF?text=Login+Page

Dashboard
https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=Admin+Dashboard

Sweet Listing
https://via.placeholder.com/800x400/FFD166/000000?text=Sweet+Inventory

Admin Panel
https://via.placeholder.com/800x400/2A2D43/FFFFFF?text=Admin+Management

🤝 Contributing
Development Workflow
Fork the repository

Create feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open Pull Request

Code Standards
Follow PEP 8 (Python) and Airbnb (JavaScript) guidelines

Write meaningful commit messages

Include tests for new features

Update documentation accordingly

Use TypeScript for new components

Issue Reporting
Check existing issues

Use issue templates

Provide reproduction steps

Include environment details

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text
MIT License

Copyright (c) 2024 Sweet Shop Management System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
🙏 Acknowledgments
Django team for the excellent framework

React team for the frontend library

Tailwind CSS for utility-first styling

AI Tools for development assistance

Open Source Community for countless packages

📞 Contact & Support
Email: support@sweetshop.com

GitHub Issues: Report Bugs

Documentation: API Docs

🏆 Project Status
Component	Status	Notes
Backend API	✅ Complete	All endpoints functional
Frontend UI	✅ Complete	Responsive design
Database	✅ Complete	PostgreSQL with migrations
Authentication	✅ Complete	JWT with refresh
Testing	✅ Complete	TDD followed
Documentation	✅ Complete	Comprehensive docs
Deployment	⚠️ Ready	Not deployed yet
Last Updated: December 2024
Version: 1.0.0

