# Bible Story Sales Page - React Application

A comprehensive React-based sales page with video unlock mechanism, user authentication, and admin dashboard functionality.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/               # Main application pages
├── AuthContext.jsx      # Authentication system
├── App.jsx              # Main application routing
├── main.jsx             # Application entry point
├── styles.css           # Global styles
└── index.html           # HTML template
```

## 🔐 Authentication System

The application uses a mock authentication system with localStorage for session management.

### User Roles

- **Admin**: Full access to admin dashboard (`/admin`)
- **User**: Regular user access to main application

### Default Credentials

```javascript
// Admin
Email: admin@biblestory.ph
Password: admin123

// User
Email: user@biblestory.ph
Password: user123
```

## 📝 Key Features

### 1. User Authentication

**Login Flow:**

1. User navigates to `/login`
2. Enters email and password
3. System validates credentials against mock database
4. On success: creates session in localStorage, redirects based on role
5. On failure: shows error message

**Signup Flow (NEW!):**

1. User navigates to `/signup`
2. Fills out registration form (name, email, password, role)
3. System validates input and checks for duplicate emails
4. Creates new user in mock database
5. Automatically logs in the new user
6. Redirects based on selected role

### 2. Protected Routes

The application uses `ProtectedRoute` component to restrict access:

```jsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

### 3. Session Management

- **Session Duration**: 24 hours
- **Storage**: localStorage with key `auth_session`
- **Auto-login**: Checks for existing session on app load

## 🛠️ Development Setup

### Prerequisites

- Node.js v18+
- npm v9+
- Modern browser (Chrome, Firefox, Edge)

### Installation

```bash
# Clone the repository (if applicable)
git clone [repository-url]
cd bible-story-sales-page

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Create production build                  |
| `npm run preview` | Preview production build locally         |

## 🧪 Testing

### Manual Testing

1. **Login Test**:

   - Navigate to `/login`
   - Try default credentials
   - Verify admin redirects to `/admin`, user redirects to `/`

2. **Signup Test (NEW!)**:

   - Navigate to `/signup`
   - Fill out form with valid data
   - Select "Admin" role
   - Verify successful signup and redirect to `/admin`
   - Try signing up with same email again (should fail)

3. **Protected Route Test**:
   - Log out and try accessing `/admin` directly
   - Should redirect to login page

### Test Data

```javascript
// Mock user data structure
{
  email: 'user@example.com',
  password: 'password123',
  role: 'user', // or 'admin'
  name: 'User Name'
}
```

## 📦 Key Components

### AuthContext.jsx

Manages authentication state and provides:

- `user`: Current authenticated user object
- `login(email, password)`: Authenticate user
- `logout()`: End current session
- `signup(userData)`: Create new user (NEW!)
- `hasRole(role)`: Check if user has specific role
- `isAuthenticated()`: Check authentication status

### ProtectedRoute.jsx

Route wrapper that handles:

- Authentication checks
- Role-based access control
- Redirects to login when unauthorized
- Loading states

### Signup.jsx (NEW!)

User registration component with:

- Form validation
- Password confirmation
- Role selection (user/admin)
- Error handling
- Success feedback
- Auto-login after signup

## 🎨 Styling

The application uses CSS modules and global styles:

- **Global Styles**: `src/styles.css`
- **Component Styles**: Inline styles and CSS classes
- **Responsive Design**: Mobile-friendly layout

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
# Development
VITE_API_BASE_URL=/api
VITE_APP_TITLE=Bible Story Sales Page

# Production
VITE_PROD_API_BASE_URL=https://api.example.com
```

### Vite Configuration

Edit `vite.config.js` for:

- Base URL
- Proxy settings
- Build optimization
- Environment variables

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

1. **Vercel**: Automatic deployment from Git repository
2. **Netlify**: Drag-and-drop build folder
3. **Static Hosting**: Upload `dist/` folder to any static host
4. **Node Server**: Serve with Express or similar

## 🐛 Common Issues & Solutions

### Issue: Login not working

**Solution:**

1. Check browser console for errors
2. Clear localStorage and try again
3. Verify mock users are initialized

### Issue: Protected routes not working

**Solution:**

1. Check AuthContext provider is wrapping the app
2. Verify session data structure in localStorage
3. Ensure role-based checks are correct

### Issue: Signup not working (NEW!)

**Solution:**

1. Check if mock users are initialized in localStorage
2. Verify email is not already registered
3. Ensure password meets minimum requirements (6+ characters)
4. Check browser console for validation errors

## 📚 Learning Resources

### React Basics

- [React Official Documentation](https://react.dev/learn)
- [React Router v6 Guide](https://reactrouter.com/en/main)

### Authentication Patterns

- [Auth in React Apps](https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/)
- [JWT vs Session Auth](https://blog.logrocket.com/jwt-authentication-best-practices/)

### State Management

- [React Context API](https://react.dev/reference/react/useContext)
- [useState vs useReducer](https://react.dev/reference/react/useReducer)

## 🤝 Contributing

### Code Style Guide

- Use functional components with hooks
- Follow React naming conventions
- Add PropTypes for component props
- Write clear, descriptive comments
- Keep components small and focused

### Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request with clear description

## 📞 Support

For issues or questions:

1. Check the [Issues](https://github.com/your-repo/issues) section
2. Review this documentation
3. Contact project maintainers

---

**Happy Coding!** 🎉

_This README provides comprehensive documentation for junior developers to understand and work with the Bible Story Sales Page application, including the new signup functionality._
