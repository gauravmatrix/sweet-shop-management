@echo off
echo Creating Sweet Shop Frontend Files...

REM Contexts
echo Creating context files...
type nul > src\contexts\AuthContext.jsx
type nul > src\contexts\SweetContext.jsx
type nul > src\contexts\ThemeContext.jsx

REM Services
echo Creating service files...
type nul > src\services\api.js
type nul > src\services\authService.js
type nul > src\services\sweetService.js
type nul > src\services\adminService.js

REM Utils
echo Creating utility files...
type nul > src\utils\constants.js
type nul > src\utils\helpers.js
type nul > src\utils\validators.js
type nul > src\utils\formatters.js

REM Hooks
echo Creating hook files...
type nul > src\hooks\useAuth.js
type nul > src\hooks\useSweets.js
type nul > src\hooks\useAPI.js
type nul > src\hooks\useToast.js

REM Styles
echo Creating style files...
type nul > src\styles\theme.js
type nul > src\styles\animations.css
type nul > src\styles\global.css

REM Layout Components
echo Creating layout components...
type nul > src\components\Layout\Navbar.jsx
type nul > src\components\Layout\Footer.jsx
type nul > src\components\Layout\Sidebar.jsx
type nul > src\components\Layout\Layout.jsx
type nul > src\components\Layout\ProtectedRoute.jsx

REM Auth Components
echo Creating auth components...
type nul > src\components\Auth\LoginForm.jsx
type nul > src\components\Auth\RegisterForm.jsx
type nul > src\components\Auth\ProfileForm.jsx
type nul > src\components\Auth\PasswordChangeForm.jsx

REM Sweet Components
echo Creating sweet components...
type nul > src\components\Sweets\SweetCard.jsx
type nul > src\components\Sweets\SweetList.jsx
type nul > src\components\Sweets\SweetForm.jsx
type nul > src\components\Sweets\SweetFilters.jsx
type nul > src\components\Sweets\SweetDetails.jsx
type nul > src\components\Sweets\PurchaseModal.jsx
type nul > src\components\Sweets\RestockModal.jsx

REM Common Components
echo Creating common components...
type nul > src\components\Common\Button.jsx
type nul > src\components\Common\Input.jsx
type nul > src\components\Common\Modal.jsx
type nul > src\components\Common\Loading.jsx
type nul > src\components\Common\Error.jsx
type nul > src\components\Common\Card.jsx
type nul > src\components\Common\Table.jsx
type nul > src\components\Common\SearchBar.jsx
type nul > src\components\Common\Pagination.jsx

REM Admin Components
echo Creating admin components...
type nul > src\components\Admin\AdminPanel.jsx
type nul > src\components\Admin\UserTable.jsx
type nul > src\components\Admin\StatsCard.jsx
type nul > src\components\Admin\DashboardStats.jsx
type nul > src\components\Admin\BulkOperations.jsx

REM Home Pages
echo Creating home pages...
type nul > src\pages\Home\HomePage.jsx
type nul > src\pages\Home\LandingPage.jsx

REM Auth Pages
echo Creating auth pages...
type nul > src\pages\Auth\LoginPage.jsx
type nul > src\pages\Auth\RegisterPage.jsx
type nul > src\pages\Auth\ProfilePage.jsx

REM Dashboard Pages
echo Creating dashboard pages...
type nul > src\pages\Dashboard\UserDashboard.jsx
type nul > src\pages\Dashboard\AdminDashboard.jsx
type nul > src\pages\Dashboard\StatsPage.jsx

REM Sweets Pages
echo Creating sweets pages...
type nul > src\pages\Sweets\SweetsPage.jsx
type nul > src\pages\Sweets\SweetDetailPage.jsx
type nul > src\pages\Sweets\AddSweetPage.jsx
type nul > src\pages\Sweets\EditSweetPage.jsx

REM Admin Pages
echo Creating admin pages...
type nul > src\pages\Admin\ManageSweetsPage.jsx
type nul > src\pages\Admin\ManageUsersPage.jsx
type nul > src\pages\Admin\ReportsPage.jsx

REM Core Files
echo Creating core files...
type nul > src\App.jsx
type nul > src\App.css
type nul > src\index.jsx
type nul > src\index.css

echo.
echo ✅ All 55 files created successfully!
echo.
pause