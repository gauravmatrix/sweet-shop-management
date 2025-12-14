# 🍬 Sweet Shop Management System

A full-stack sweet shop management system built with Django REST Framework backend and React frontend, following Test-Driven Development (TDD) principles.

![Sweet Shop](https://img.shields.io/badge/Sweet-Shop-FF6B8B)
![Django](https://img.shields.io/badge/Django-5.0-092E20)
![React](https://img.shields.io/badge/React-18.2-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

## 🎯 Project Overview

This project implements a complete sweet shop management system with user authentication, inventory management, purchase/restock functionality, and admin dashboard. Built as part of a technical assessment following modern development practices including TDD, clean code, and AI-assisted development.

## 📋 Features

### ✅ Backend (Django REST Framework)
- **User Authentication**: JWT-based authentication with role-based permissions (Admin/User)
- **Sweet CRUD**: Full CRUD operations for sweet inventory
- **Inventory Management**: Purchase and restock functionality
- **Search & Filters**: Advanced search with category, price range, and availability filters
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **API Documentation**: Swagger/OpenAPI documentation
- **TDD Implementation**: Complete test suite following Red-Green-Refactor pattern

### ✅ Frontend (React)
- **Modern UI**: Professional sweet shop themed interface
- **Responsive Design**: Mobile-friendly responsive layout
- **User Authentication**: Login, registration, and profile management
- **Sweet Management**: View, search, purchase sweets
- **Admin Features**: Full admin control panel
- **Real-time Updates**: React Query for efficient data fetching

## 🏗️ Tech Stack

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL (with SQLite fallback)
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API Docs**: drf-yasg (Swagger/OpenAPI)
- **Testing**: pytest, Django Test Framework
- **Other**: django-cors-headers, django-filter, python-dotenv

### Frontend
- **Framework**: React 18.2
- **State Management**: React Query, Context API
- **UI Library**: Tailwind CSS, Material-UI Icons
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (or SQLite for development)
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/your-username/sweet-shop-management.git
cd sweet-shop-management

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py create_sample_data

# Run development server
python manage.py runserver