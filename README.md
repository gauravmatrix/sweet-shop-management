📌 Project Title

Sweet Shop Management System

📖 Project Description

The Sweet Shop Management System is a full-stack web application designed to manage sweets inventory, categories, stock levels, and user activities efficiently. It provides a clean dashboard for monitoring sales, stock status, and low-inventory alerts with role-based access for admin and users.

🛠️ Tech Stack
Frontend

React.js (Create React App)

Tailwind CSS

Recharts (for charts)

Lucide React Icons

Backend

Django / Django REST Framework (as per project)

PostgreSQL (if used)

Tools

Git & GitHub

npm

VS Code

✨ Features

User Authentication (Admin / User)

Dashboard with statistics

Sweet inventory management

Category-wise stock tracking

Low stock alerts

Responsive UI

Clean Tailwind-based design

📂 Project Structure
sweet-shop-management/
│
├── backend/
│   ├── manage.py
│   ├── sweet_shop/
│   └── api/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md

⚙️ Installation & Setup
Frontend Setup
cd frontend
npm install --legacy-peer-deps
npm start

Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

🌐 Application Access

Frontend: http://localhost:3000

Backend API: http://localhost:8000/api/

👤 User Roles
Admin

Manage sweets

View dashboard analytics

Manage users

User

View sweets

Make purchases

View stock availability

📊 Dashboard Modules

Total sweets

Inventory value

In-stock / low-stock indicators

Sales overview chart

Category distribution chart

Recent activities

🔗 GitHub Repository
https://github.com/gauravmatrix/sweet-shop-management


