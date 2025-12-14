<div align="center">
    <h1>🍬 Sweet Shop Management System 🍬</h1>
    <p>A full-stack solution for managing sweet inventory, purchases, and customer experience.</p>
    <p>
        <img src="https://img.shields.io/badge/Django-5.0-green.svg" alt="Django 5.0">
        <img src="https://img.shields.io/badge/React-18.2-blue.svg" alt="React 18.2">
        <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License MIT">
    </p>
</div>

<hr>

<h2>📋 Table of Contents</h2>

<ul>
    <li><a href="#-project-overview">📖 Project Overview</a></li>
    <li><a href="#-features">🎯 Features</a></li>
    <li><a href="#️-tech-stack">🛠️ Tech Stack</a></li>
    <li><a href="#-installation--setup">🚀 Installation &amp; Setup</a></li>
    <li><a href="#-project-structure">📁 Project Structure</a></li>
    <li><a href="#-api-documentation">🔧 API Documentation</a></li>
    <li><a href="#-testing">🧪 Testing</a></li>
    <li><a href="#-ai-usage-policy">🤖 AI Usage Policy</a></li>
    <li><a href="#-screenshots">📸 Screenshots</a></li>
    <li><a href="#-deployment">🚀 Deployment</a></li>
    <li><a href="#-license">📄 License</a></li>
    <li><a href="#-contributors">👥 Contributors</a></li>
    <li><a href="#-acknowledgments">🙏 Acknowledgments</a></li>
</ul>

<hr>

<h2 id="-project-overview">📖 Project Overview</h2>

<p>A full-stack <strong>Sweet Shop Management System</strong> built with <strong>Django REST Framework</strong> (backend) and <strong>React</strong> (frontend). This application allows shop owners to manage their sweet inventory, handle purchases, and provide customers with an engaging shopping experience.</p>

<h3>🎯 Core Requirements Met:</h3>

<ul>
    <li>✅ <strong>RESTful API</strong> with JWT Authentication</li>
    <li>✅ <strong>Modern SPA Frontend</strong> with React</li>
    <li>✅ <strong>PostgreSQL Database</strong> integration</li>
    <li>✅ <strong>Test-Driven Development (TDD)</strong> implementation</li>
    <li>✅ <strong>Clean Code</strong> following SOLID principles</li>
    <li>✅ <strong>Git Version Control</strong> with AI co-authors</li>
    <li>✅ <strong>Professional UI/UX</strong> with sweet shop theme</li>
</ul>

<hr>

<h2 id="-features">🎯 Features</h2>

<h3>🔐 Authentication &amp; Authorization</h3>
<ul>
    <li>User registration with email verification</li>
    <li>JWT token-based authentication</li>
    <li>Role-based access (Admin vs Regular Users)</li>
    <li>Password reset functionality</li>
    <li>Profile management</li>
</ul>

<h3>🍬 Sweet Management</h3>
<ul>
    <li><strong>CRUD</strong> Operations: Create, Read, Update, Delete sweets</li>
    <li><strong>Inventory Management</strong>: Track stock levels</li>
    <li><strong>Advanced Search</strong>: Filter by category, price range, availability</li>
    <li><strong>Purchase System</strong>: Customers can purchase sweets</li>
    <li><strong>Restock Feature</strong>: Admin can restock inventory</li>
    <li><strong>Featured Items</strong>: Highlight popular sweets</li>
</ul>

<h3>📊 Dashboard &amp; Analytics</h3>
<ul>
    <li>Real-time inventory statistics</li>
    <li>Sales reports and trends</li>
    <li>Low stock alerts</li>
    <li>Category-wise analysis</li>
    <li>Revenue tracking</li>
</ul>

<h3>👥 User Management</h3>
<ul>
    <li>Admin panel for user management</li>
    <li>Role assignment (Admin/User)</li>
    <li>Activity logging</li>
    <li>Profile customization</li>
</ul>

<hr>

<h2 id="️-tech-stack">🛠️ Tech Stack</h2>

<h3>Backend (Django)</h3>
<pre><code>├── Django 5.0
├── Django REST Framework 3.14
├── Django REST Framework Simple JWT
├── PostgreSQL / SQLite
├── Django CORS Headers
├── Django Filter
├── DRF Yasg (Swagger)
└── Python 3.13
</code></pre>

<h3>Frontend (React)</h3>
<pre><code>├── React 18.2
├── React Router DOM 6.20
├── React Query (TanStack)
├── React Hook Form
├── Tailwind CSS 3.3
├── Material-UI (MUI)
├── Recharts (Data Visualization)
├── Axios (HTTP Client)
└── React Hot Toast (Notifications)
</code></pre>

<h3>Development Tools</h3>
<pre><code>├── Git with AI Co-authors
├── Pytest (Testing)
├── Django Debug Toolbar
├── Black &amp; Flake8 (Code Formatting)
├── Pre-commit Hooks
└── Docker (Optional)
</code></pre>

<hr>

<h2 id="-installation--setup">🚀 Installation &amp; Setup</h2>

<h3>Prerequisites</h3>
<ul>
    <li><strong>Python 3.13+</strong></li>
    <li><strong>Node.js 18+</strong></li>
    <li><strong>PostgreSQL</strong> (or SQLite for development)</li>
    <li><strong>Git</strong></li>
</ul>

<h3>Backend Setup</h3>
<pre><code class="language-bash"># Clone the repository
git clone https://github.com/yourusername/sweet-shop-management.git
cd sweet-shop-management

# Create and activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env file with your configurations

# Run database migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Load sample data (optional)
python manage.py create_sample_data

# Start development server
python manage.py runserver
</code></pre>

<h3>Frontend Setup</h3>
<pre><code class="language-bash"># Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your API URL

# Start development server
npm start

# For production build
npm run build
</code></pre>

<h3>Database Setup (PostgreSQL)</h3>
<pre><code class="language-sql">-- Create database
CREATE DATABASE sweet_shop_db;

-- Create user
CREATE USER sweet_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sweet_shop_db TO sweet_user;
</code></pre>

<hr>

<h2 id="-project-structure">📁 Project Structure</h2>

<pre><code>sweet-shop-management/
├── api/                          # Django app for sweet management
│   ├── models.py                 # Sweet model definitions
│   ├── serializers.py            # DRF serializers
│   ├── views.py                  # API views and endpoints
│   ├── urls.py                   # API routing
│   ├── tests.py                  # TDD tests
│   └── admin.py                  # Django admin customization
├── users/                        # Django app for authentication
│   ├── models.py                 # Custom User model
│   ├── serializers.py            # User serializers
│   ├── views.py                  # Auth views
│   └── urls.py                   # Auth endpoints
├── sweet_shop/                   # Django project settings
│   ├── settings.py               # Project configuration
│   ├── urls.py                   # Main URL routing
│   └── wsgi.py                   # WSGI configuration
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout/          # Layout components
│   │   │   ├── Auth/            # Authentication components
│   │   │   ├── Sweets/          # Sweet-related components
│   │   │   ├── Common/          # Shared components
│   │   │   └── Admin/           # Admin components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # Global styles
│   ├── public/                   # Static assets
│   └── package.json             # Dependencies
├── requirements.txt              # Python dependencies
├── manage.py                     # Django management script
└── README.md                     # Project documentation
</code></pre>

<hr>

<h2 id="-api-documentation">🔧 API Documentation</h2>

<h3>Base URL</h3>
<pre><code>http://localhost:8000/api/
</code></pre>

<h3>Authentication Endpoints</h3>

<table>
<thead>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Auth Required</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>POST</code></td>
<td><code>/auth/register/</code></td>
<td>Register new user</td>
<td>No</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/auth/login/</code></td>
<td>Login and get JWT tokens</td>
<td>No</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/auth/refresh/</code></td>
<td>Refresh access token</td>
<td>Yes</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/auth/profile/</code></td>
<td>Get user profile</td>
<td>Yes</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/auth/profile/update/</code></td>
<td>Update profile</td>
<td>Yes</td>
</tr>
</tbody>
</table>

<h3>Sweet Management Endpoints</h3>

<table>
<thead>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Auth Required</th>
<th>Admin Only</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>GET</code></td>
<td><code>/sweets/</code></td>
<td>List all sweets</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/sweets/</code></td>
<td>Create new sweet</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><code>GET</code></td>
<td><code>/sweets/{id}/</code></td>
<td>Get sweet details</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<td><code>PUT</code></td>
<td><code>/sweets/{id}/</code></td>
<td>Update sweet</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><code>DELETE</code></td>
<td><code>/sweets/{id}/</code></td>
<td>Delete sweet</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/sweets/{id}/purchase/</code></td>
<td>Purchase sweet</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<td><code>POST</code></td>
<td><code>/sweets/{id}/restock/</code></td>
<td>Restock sweet</td>
<td>Yes</td>
<td>Yes</td>
</tr>
</tbody>
</table>

<h3>Search &amp; Filter Parameters</h3>
<pre><code class="language-http">GET /api/sweets/?category=chocolate&amp;min_price=50&amp;max_price=200&amp;available_only=true
</code></pre>

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>category</code></td>
<td>Filter by sweet category</td>
</tr>
<tr>
<td><code>min_price</code></td>
<td>Minimum price filter</td>
</tr>
<tr>
<td><code>max_price</code></td>
<td>Maximum price filter</td>
</tr>
<tr>
<td><code>available_only</code></td>
<td>Show only available sweets (<code>true</code> or <code>false</code>)</td>
</tr>
<tr>
<td><code>search</code></td>
<td>Search in name/description fields</td>
</tr>
<tr>
<td><code>ordering</code></td>
<td>Sort results (e.g., <code>price</code>, <code>-name</code>)</td>
</tr>
<tr>
<td><code>page</code></td>
<td>Pagination support</td>
</tr>
</tbody>
</table>

<h3>Sample API Request (Registration)</h3>
<pre><code class="language-javascript">// Register a new user
fetch('http://localhost:8000/api/auth/register/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'sweetlover',
    password: 'SecurePass123!',
    password_confirm: 'SecurePass123!'
  })
})
</code></pre>

<h3>API Documentation URLs</h3>
<ul>
    <li><strong>Swagger UI</strong>: <code>http://localhost:8000/swagger/</code></li>
    <li><strong>ReDoc</strong>: <code>http://localhost:8000/redoc/</code></li>
    <li><strong>OpenAPI Schema</strong>: <code>http://localhost:8000/swagger.json</code></li>
</ul>

<hr>

<h2 id="-testing">🧪 Testing</h2>

<p>We follow a <strong>Test-Driven Development (TDD)</strong> approach for high quality and reliability.</p>

<h3>Backend Testing</h3>
<pre><code class="language-bash"># Run all tests
python manage.py test

# Run specific app tests
python manage.py test api
python manage.py test users

# Run with coverage report
coverage run manage.py test
coverage report
coverage html
</code></pre>

<h3>Frontend Testing</h3>
<pre><code class="language-bash"># Navigate to frontend directory
cd frontend

# Run React tests
npm test

# Run with coverage
npm test -- --coverage
</code></pre>

<h3>Test Coverage</h3>
<ul>
    <li>✅ <strong>Unit Tests</strong>: Models, serializers, utilities</li>
    <li>✅ <strong>Integration Tests</strong>: API endpoints</li>
    <li>✅ <strong>Authentication Tests</strong>: Login, register, token refresh</li>
    <li>✅ <strong>Permission Tests</strong>: Admin vs user access</li>
    <li>✅ <strong>Frontend Tests</strong>: Component rendering, user interactions</li>
</ul>

<hr>

<h2 id="-ai-usage-policy">🤖 AI Usage Policy</h2>

<h3>Transparency Statement</h3>
<p>This project was developed with the assistance of AI tools to enhance productivity and code quality. All AI-assisted contributions are properly documented.</p>

<h3>AI Tools Used</h3>
<ul>
    <li><strong>GitHub Copilot</strong>: For code completion and boilerplate generation</li>
    <li><strong>ChatGPT/DeepSeek</strong>: For brainstorming, debugging, and documentation</li>
    <li><strong>AI-powered Code Review</strong>: For identifying potential issues and improvements</li>
</ul>

<h3>Commit Guidelines with AI Co-authors</h3>
<pre><code class="language-bash"># Example commit with AI co-author
git commit -m "feat: Implement sweet purchase functionality

- Added purchase endpoint with stock validation
- Implemented transaction logging
- Added tests for edge cases

Co-authored-by: AI Assistant &lt;ai@example.com&gt;"
</code></pre>

<h3>How AI Was Used</h3>
<ul>
    <li><strong>Code Generation</strong>: Initial boilerplate code for models, serializers, and views</li>
    <li><strong>Test Writing</strong>: Assistance in creating comprehensive test cases</li>
    <li><strong>Debugging Help</strong>: Identifying and fixing complex bugs</li>
    <li><strong>Documentation</strong>: Generating API documentation and comments</li>
    <li><strong>Code Optimization</strong>: Suggestions for performance improvements</li>
</ul>

<h3>Human Oversight</h3>
<p>All AI-generated code was:</p>
<ul>
    <li>✅ <strong>Manually reviewed</strong> for correctness</li>
    <li>✅ <strong>Tested thoroughly</strong> before integration</li>
    <li>✅ <strong>Customized</strong> to fit project requirements</li>
    <li>✅ <strong>Documented</strong> with clear explanations</li>
</ul>

<hr>

<h2 id="-screenshots">📸 Screenshots</h2>

<table>
<thead>
<tr>
<th>View</th>
<th>Screenshot</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Dashboard View</strong></td>
<td><img src="https://via.placeholder.com/800x400/FF6B8B/FFFFFF?text=Sweet+Shop+Dashboard" alt="Sweet Shop Dashboard"></td>
</tr>
<tr>
<td><strong>Sweet Listing</strong></td>
<td><img src="https://via.placeholder.com/800x400/4ECDC4/FFFFFF?text=Sweets+Inventory" alt="Sweets Inventory"></td>
</tr>
<tr>
<td><strong>Admin Panel</strong></td>
<td><img src="https://via.placeholder.com/800x400/FFD166/000000?text=Admin+Management" alt="Admin Management"></td>
</tr>
<tr>
<td><strong>Mobile View</strong></td>
<td><img src="https://via.placeholder.com/400x800/2A2D43/FFFFFF?text=Mobile+Responsive" alt="Mobile Responsive"></td>
</tr>
</tbody>
</table>

<hr>

<h2 id="-deployment">🚀 Deployment</h2>

<h3>Backend Deployment (Heroku)</h3>
<pre><code class="language-bash"># Install Heroku CLI
heroku login

# Create Heroku app
heroku create sweet-shop-management

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Configure environment variables
heroku config:set SECRET_KEY=your_secret_key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser
</code></pre>

<h3>Frontend Deployment (Vercel)</h3>
<pre><code class="language-bash"># Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables
vercel env add REACT_APP_API_URL https://your-api.herokuapp.com/api
</code></pre>

<hr>

<h2 id="-license">📄 License</h2>

<p>This project is licensed under the <strong>MIT License</strong> - see the <code>LICENSE</code> file for details.</p>

<hr>

<h2 id="-contributors">👥 Contributors</h2>

<ul>
    <li><a href="https://github.com/yourusername">Your Name</a> - Initial work - <strong>@yourusername</strong></li>
    <li><strong>AI Assistant</strong> - Code generation and assistance</li>
</ul>

<hr>

<h2 id="-acknowledgments">🙏 Acknowledgments</h2>

<ul>
    <li>Django and React communities for amazing frameworks</li>
    <li>Open source contributors for libraries and tools</li>
    <li>AI tools for enhancing development productivity</li>
    <li>Test-driven development methodology advocates</li>
</ul>

<div align="center">
    <h3>🍬 Enjoy Managing Your Sweet Shop! 🍬</h3>
</div>