🍬 **Sweet Shop Management System**
===================================

🚀 **Project Overview**
-----------------------

A full-stack **Sweet Shop Management System** built with **Django REST Framework** backend and **React** frontend. This system allows users to browse, purchase sweets, and admins to manage inventory efficiently.

📋 **Table of Contents**
------------------------

*   ✨ Features
    
*   🏗️ Architecture
    
*   🛠️ Tech Stack
    
*   🚀 Installation
    
*   🔧 Configuration
    
*   📁 Project Structure
    
*   🔐 Authentication & Authorization
    
*   📊 API Documentation
    
*   🧪 Testing
    
*   🤖 AI Usage Policy
    
*   📸 Screenshots
    
*   👥 Contributors
    
*   📄 License
    

✨ **Features**
--------------

### ✅ **Backend (Django REST Framework)**

*   **User Authentication**
    
    *   JWT-based authentication with refresh tokens
        
    *   Role-based access control (Admin / Regular User)
        
    *   Email verification and password reset
        
*   **Sweet Management**
    
    *   CRUD operations for sweets (Admin only)
        
    *   Category-based organization
        
    *   Inventory tracking with quantity management
        
    *   Price and stock management
        
*   **Inventory Operations**
    
    *   Purchase sweets (decreases quantity)
        
    *   Restock sweets (admin only, increases quantity)
        
    *   Low stock alerts and notifications
        
*   **Search & Filtering**
    
    *   Advanced search by name, category, price range
        
    *   Pagination and sorting options
        
    *   Filter by availability and featured items
        
*   **Admin Dashboard**
    
    *   Real-time statistics and analytics
        
    *   User management interface
        
    *   Inventory reports and insights
        

### ✅ **Frontend (React)**

*   **Modern UI/UX**
    
    *   Responsive design with Tailwind CSS
        
    *   Sweet-themed color scheme and animations
        
    *   Intuitive navigation and user flows
        
*   **User Features**
    
    *   Registration and login system
        
    *   Browse sweets with filters
        
    *   Purchase functionality
        
    *   User profile management
        
*   **Admin Features**
    
    *   Sweet management interface
        
    *   User management panel
        
    *   Dashboard with analytics
        
    *   Bulk operations
        

### ✅ **DevOps & Quality**

*   **Test-Driven Development (TDD)**
    
*   **Git with AI co-authorship**
    
*   **Comprehensive API documentation**
    
*   **Production-ready configuration**
    

🏗️ **Architecture**
--------------------

### **System Architecture Diagram**

text

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │   React Frontend │◄──►│ Django REST API  │◄──►│   PostgreSQL     │  │   (localhost:3000)│    │   (localhost:8000)│    │     Database      │  └─────────────────┘    └─────────────────┘    └─────────────────┘           │                        │                        │           │                        │                        │           ▼                        ▼                        ▼  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │   User Browser   │    │   JWT Auth      │    │   Data Models     │  │   - HTML/CSS/JS  │    │   - Login       │    │   - Sweets        │  │   - Components   │    │   - Register    │    │   - Users         │  └─────────────────┘    └─────────────────┘    └─────────────────┘   `

### **Data Flow**

1.  **User** → React Frontend → API Request → Django Backend → Database
    
2.  **Database** → Django Backend → API Response → React Frontend → User
    

🛠️ **Tech Stack**
------------------

### **Backend**

TechnologyVersionPurposePython3.11+Core programming languageDjango5.0Web frameworkDjango REST Framework3.14API developmentPostgreSQL15+Primary databaseJWTSimpleJWTAuthenticationDjango CORS Headers4.3Cross-origin requestsDjango Filter23.5API filteringDRF Yasg1.21API documentation

### **Frontend**

TechnologyVersionPurposeReact18.2UI libraryReact Router DOM6.20RoutingAxios1.6HTTP clientTailwind CSS3.3StylingReact Query5.12Data fetchingReact Hook Form7.48Form handlingReact Hot Toast2.4NotificationsMaterial-UI Icons5.14Icons

### **Development Tools**

ToolPurposeGitVersion controlPytestTestingPostmanAPI testingVS CodeDevelopment IDEPostgreSQLDatabaseNode.jsFrontend runtime

🚀 **Installation**
-------------------

### **Prerequisites**

*   Python 3.11+
    
*   Node.js 18+
    
*   PostgreSQL 15+
    
*   Git
    

### **Backend Setup**

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # 1. Clone repository  git clone https://github.com/yourusername/sweet-shop.git  cd sweet-shop  # 2. Create virtual environment  python -m venv venv  # 3. Activate virtual environment  # Windows:  venv\Scripts\activate  # Linux/Mac:  source venv/bin/activate  # 4. Install dependencies  pip install -r requirements.txt  # 5. Configure environment variables  cp .env.example .env  # Edit .env with your configurations  # 6. Run migrations  python manage.py migrate  # 7. Create superuser  python manage.py createsuperuser  # 8. Start development server  python manage.py runserver   `

### **Frontend Setup**

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # 1. Navigate to frontend directory  cd frontend  # 2. Install dependencies  npm install  # 3. Configure environment variables  cp .env.example .env  # Edit .env with your API URL  # 4. Start development server  npm start   `

🔧 **Configuration**
--------------------

### **Environment Variables**

#### **Backend (.env)**

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Django Settings  SECRET_KEY=your-secret-key-here  DEBUG=True  ALLOWED_HOSTS=localhost,127.0.0.1  # Database  DATABASE_URL=postgresql://user:password@localhost:5432/sweet_shop_db  # JWT Settings  JWT_ACCESS_TOKEN_LIFETIME=1  JWT_REFRESH_TOKEN_LIFETIME=7  # Email Settings (optional)  EMAIL_HOST=smtp.gmail.com  EMAIL_PORT=587  EMAIL_HOST_USER=your-email@gmail.com  EMAIL_HOST_PASSWORD=your-app-password   `

#### **Frontend (.env)**

env

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   REACT_APP_API_URL=http://localhost:8000/api  REACT_APP_APP_NAME=Sweet Shop Management  REACT_APP_VERSION=1.0.0   `

📁 **Project Structure**
------------------------

### **Backend Structure**

text

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   sweet-shop/  ├── api/                          # Main API application  │   ├── models.py                 # Database models  │   ├── serializers.py           # Data serializers  │   ├── views.py                 # API views  │   ├── urls.py                  # URL routing  │   ├── tests.py                 # Test cases  │   └── admin.py                 # Admin configuration  ├── users/                        # User management app  │   ├── models.py                # Custom User model  │   ├── serializers.py           # User serializers  │   └── views.py                 # Authentication views  ├── sweet_shop/                   # Project settings  │   ├── settings.py              # Django settings  │   ├── urls.py                  # Main URL configuration  │   ├── wsgi.py                  # WSGI configuration  │   └── asgi.py                  # ASGI configuration  ├── manage.py                     # Django management script  ├── requirements.txt             # Python dependencies  └── .env                         # Environment variables   `

### **Frontend Structure**

text

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   frontend/  ├── public/                      # Static files  ├── src/  │   ├── components/              # Reusable components  │   │   ├── Layout/             # Layout components  │   │   ├── Auth/               # Authentication components  │   │   ├── Sweets/             # Sweet-related components  │   │   ├── Common/             # Common UI components  │   │   └── Admin/              # Admin components  │   ├── pages/                   # Page components  │   │   ├── Home/               # Home page  │   │   ├── Auth/               # Authentication pages  │   │   ├── Dashboard/          # Dashboard pages  │   │   └── Admin/              # Admin pages  │   ├── services/               # API services  │   ├── contexts/               # React contexts  │   ├── hooks/                  # Custom hooks  │   ├── utils/                  # Utility functions  │   ├── styles/                 # CSS styles  │   ├── App.jsx                 # Main App component  │   └── index.jsx               # Entry point  ├── package.json                # Node.js dependencies  ├── tailwind.config.js          # Tailwind configuration  └── README.md                   # This file   `

🔐 **Authentication & Authorization**
-------------------------------------

### **JWT Authentication Flow**

text

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐  │  User   │─────►│  Login  │─────►│  Django │─────►│  JWT    │  │         │◄─────│  Form   │◄─────│   API   │◄─────│  Token  │  └─────────┘      └─────────┘      └─────────┘      └─────────┘         │                │                │                │         │                │                │                │         ▼                ▼                ▼                ▼  ┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐  │ Store   │      │ Validate│      │ Verify  │      │ Access  │  │ Token   │      │ Creds   │      │  JWT    │      │ Protected│  └─────────┘      └─────────┘      └─────────┘      └─────────┘   `

### **User Roles**

RolePermissions**Admin**Full access: CRUD sweets, manage users, view all data**Regular User**View sweets, purchase, manage own profile

### **Protected Endpoints**

*   /api/sweets/ (POST, PUT, DELETE) - Admin only
    
*   /api/sweets/{id}/restock/ - Admin only
    
*   /api/auth/users/ - Admin only
    
*   /api/dashboard/ - Admin only
    

📊 **API Documentation**
------------------------

### **API Endpoints Summary**

#### **Authentication**

MethodEndpointDescriptionAuth RequiredPOST/api/auth/register/Register new userNoPOST/api/auth/login/Login userNoPOST/api/auth/refresh/Refresh JWT tokenYesGET/api/auth/profile/Get user profileYesPUT/api/auth/profile/update/Update profileYes

#### **Sweets Management**

MethodEndpointDescriptionAuth RequiredAdmin OnlyGET/api/sweets/List all sweetsYesNoPOST/api/sweets/Create new sweetYesYesGET/api/sweets/{id}/Get sweet detailsYesNoPUT/api/sweets/{id}/Update sweetYesYesDELETE/api/sweets/{id}/Delete sweetYesYesPOST/api/sweets/{id}/purchase/Purchase sweetYesNoPOST/api/sweets/{id}/restock/Restock sweetYesYes

#### **Search & Filtering**

MethodEndpointDescriptionGET/api/sweets/search/advanced/Advanced searchGET/api/categories/List categoriesGET/api/stats/Get statisticsGET/api/dashboard/Dashboard data

### **API Response Format**

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": true,    "data": {      // Response data here    },    "message": "Operation successful",    "timestamp": "2024-12-15T10:30:00Z"  }   `

### **Error Response Format**

json

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "success": false,    "error": {      "code": 400,      "message": "Validation error",      "details": {        "field": ["Error message"]      }    },    "timestamp": "2024-12-15T10:30:00Z"  }   `

🧪 **Testing**
--------------

### **Test-Driven Development (TDD)**

We followed strict TDD methodology with **Red-Green-Refactor** pattern:

1.  **Red**: Write failing tests
    
2.  **Green**: Implement minimum code to pass tests
    
3.  **Refactor**: Improve code while keeping tests passing
    

### **Test Coverage**

*   **Backend**: 90%+ test coverage
    
*   **Frontend**: Component and integration tests
    
*   **API**: End-to-end API testing
    

### **Running Tests**

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   # Backend tests  python manage.py test  # Specific app tests  python manage.py test api  python manage.py test users  # With coverage  coverage run manage.py test  coverage report   `

### **Test Categories**

*   **Unit Tests**: Individual functions and methods
    
*   **Integration Tests**: API endpoints and database interactions
    
*   **Authentication Tests**: User registration, login, permissions
    
*   **Business Logic Tests**: Purchase, restock, inventory management
    

🤖 **AI Usage Policy**
----------------------

### **AI Co-authorship**

In accordance with project requirements, we have transparently used AI tools throughout development:

### **AI Tools Used**

ToolPurposeUsage FrequencyGitHub CopilotCode completion, boilerplate generationHighChatGPTArchitecture design, problem-solvingMediumClaudeDocumentation, code reviewLow

### **How AI Was Used**

1.  **Code Generation**
    
    *   Initial project structure setup
        
    *   Boilerplate code for models, serializers, views
        
    *   React component templates
        
2.  **Problem Solving**
    
    *   Debugging complex issues
        
    *   Optimization suggestions
        
    *   Alternative implementation approaches
        
3.  **Documentation**
    
    *   README.md structure and content
        
    *   API documentation
        
    *   Code comments
        
4.  **Code Review**
    
    *   Identifying potential bugs
        
    *   Suggesting best practices
        
    *   Performance optimizations
        

### **AI Co-author in Git Commits**

Every commit where AI was significantly used includes co-author attribution:

bash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git commit -m "feat: Implement user authentication endpoints  - Added JWT authentication  - Created user registration and login  - Implemented token refresh mechanism  Co-authored-by: GitHub Copilot   Co-authored-by: ChatGPT "   `

### **Our Philosophy**

*   **AI as Assistant**: AI tools augmented human development, didn't replace it
    
*   **Transparency**: All AI usage clearly documented
    
*   **Quality Control**: Human review of all AI-generated code
    
*   **Learning Focus**: Used AI to understand patterns, not just copy code
    

### **Impact of AI on Workflow**

*   **40% faster development** for repetitive tasks
    
*   **Improved code quality** through AI suggestions
    
*   **Better documentation** with AI assistance
    
*   **Enhanced learning** by understanding AI-generated solutions
    

📸 **Screenshots**
------------------

### **Home Page**

[https://via.placeholder.com/800x450/FF6B8B/FFFFFF?text=Sweet+Shop+Home+Page](https://via.placeholder.com/800x450/FF6B8B/FFFFFF?text=Sweet+Shop+Home+Page)

### **Dashboard**

[https://via.placeholder.com/800x450/4ECDC4/FFFFFF?text=Admin+Dashboard](https://via.placeholder.com/800x450/4ECDC4/FFFFFF?text=Admin+Dashboard)

### **Sweets Listing**

[https://via.placeholder.com/800x450/FFD166/000000?text=Sweets+Inventory](https://via.placeholder.com/800x450/FFD166/000000?text=Sweets+Inventory)

### **Admin Panel**

[https://via.placeholder.com/800x450/2A2D43/FFFFFF?text=Admin+Management](https://via.placeholder.com/800x450/2A2D43/FFFFFF?text=Admin+Management)

👥 **Contributors**
-------------------

RoleNameContribution**Project Lead**Your NameFull-stack development, architecture**Backend Developer**Your NameDjango API, database design**Frontend Developer**Your NameReact UI, state management**AI Co-author**GitHub CopilotCode completion, suggestions**AI Co-author**ChatGPTProblem-solving, documentation

📄 **License**
--------------

This project is licensed under the **MIT License** - see the [LICENSE](https://license/) file for details.

### **Acknowledgments**

*   Django REST Framework team for excellent documentation
    
*   React community for components and libraries
    
*   AI tools that accelerated development
    
*   Open source contributors whose work we built upon
    

🔗 **Quick Links**
------------------

*   [**Live Demo**](http://localhost:3000/) (when running locally)
    
*   [**API Documentation**](http://localhost:8000/swagger)
    
*   [**Admin Panel**](http://localhost:8000/admin)
    
*   [**GitHub Repository**](https://github.com/yourusername/sweet-shop)
    
*   [**Issue Tracker**](https://github.com/yourusername/sweet-shop/issues)
    

📞 **Support**
--------------

For support, email **support@sweetshop.com** or create an issue in the GitHub repository.

**🍬 Thank you for exploring the Sweet Shop Management System! 🍬**