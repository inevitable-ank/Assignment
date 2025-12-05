# 🎯 TaskFlow - Frontend

> A modern, responsive task management application built with React, TypeScript, and TailwindCSS featuring real-time session management and natural language task parsing.

[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Features Deep Dive](#-features-deep-dive)
- [Styling](#-styling)
- [Deployment](#-deployment)

---

## ✨ Features

### 🎨 User Interface
- **Modern, glassmorphism design** with smooth animations
- **Dark mode support** with system preference detection
- **Fully responsive** - Works on mobile, tablet, and desktop
- **Smooth transitions** and micro-interactions
- **Loading states** and skeleton screens

### 📝 Task Management
- **Multiple view modes**: List, Kanban Board, and Analytics
- **Natural language input** - "Meet Amy tomorrow 4pm urgent"
- **Task filtering** by status (all, pending, completed)
- **Priority levels** (low, medium, high) with color coding
- **Due dates** with visual indicators
- **Drag-and-drop** Kanban board (coming soon)

### 🔐 Authentication & Security
- **Secure login/registration** with form validation
- **JWT token management** with automatic refresh
- **Session management dashboard**
- **Multi-device tracking** - See all active sessions
- **Instant session revocation** - Kick out devices remotely
- **Real-time logout** when session is revoked

### 📊 Analytics Dashboard
- **Task completion statistics**
- **Priority distribution charts**
- **Activity over time graphs**
- **Completion rate tracking**
- **Visual insights** with animated charts

### 👤 User Profile
- **Profile editing** with validation
- **Password change** functionality
- **Account information** display
- **Session overview** with device details

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 18 | UI library |
| **Language** | TypeScript | Type safety |
| **Build Tool** | Vite | Fast development & building |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Routing** | React Router | Client-side routing |
| **Forms** | React Hook Form | Form management |
| **Validation** | Zod | Schema validation |
| **Icons** | Lucide React | Beautiful icons |
| **Charts** | Recharts | Data visualization |
| **Date Handling** | date-fns | Date utilities |

---

## 📸 Screenshots

### 🏠 Dashboard - List View
```
┌─────────────────────────────────────────────┐
│  TaskFlow          👤 John Doe              │
├─────────────────────────────────────────────┤
│  My Tasks                   [+ New Task]    │
│  List  Kanban  Analytics  Sessions          │
│                                             │
│  📋 Quick Add Task                          │
│  Type a task... "Meet Amy tomorrow 4pm"     │
│                                             │
│  [all] [pending (5)] [completed (12)]       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ⚠️ Complete project presentation    │   │
│  │ Due: Tomorrow • High priority       │   │
│  │ [Edit] [Complete] [Delete]          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 🖥️ Session Management
```
┌─────────────────────────────────────────────┐
│  🔒 Active Sessions                         │
│  Manage your device connections             │
│                                             │
│  ℹ️ No Other Active Sessions                │
│  You're only signed in on this device       │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 💻 Chrome on Windows [CURRENT]      │   │
│  │ 🌐 192.168.1.100                    │   │
│  │ 🕒 Last active: Dec 5, 02:15 AM     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  🛡️ Security Tips                           │
│  🔐 Always sign out on shared devices       │
│  ⚠️ Review active sessions regularly        │
│                                             │
│  ⚠️ Danger Zone                             │
│  [🚫 Sign Out All Other Devices]           │
└─────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

The app will hot-reload as you make changes! 🔥

---

## 📁 Project Structure

```
my-app/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── auth/            # Authentication pages
│   │   ├── login/
│   │   │   └── index.tsx
│   │   └── register/
│   │       └── index.tsx
│   ├── components/      # Reusable components
│   │   ├── dashboard/
│   │   │   ├── analytics-dashboard.tsx
│   │   │   ├── create-task-modal.tsx
│   │   │   ├── kanban-board.tsx
│   │   │   ├── natural-language-parser.tsx
│   │   │   ├── session-manager.tsx
│   │   │   ├── task-card.tsx
│   │   │   ├── task-header.tsx
│   │   │   └── task-list.tsx
│   │   ├── Layout.tsx
│   │   └── navigation.tsx
│   ├── config/          # Configuration files
│   │   └── api.ts       # API endpoints & utilities
│   ├── dashboard/       # Dashboard page
│   │   └── index.tsx
│   ├── home/            # Landing page
│   │   └── index.tsx
│   ├── profile/         # Profile page
│   │   └── index.tsx
│   ├── App.tsx          # Main app component
│   ├── App.css          # Global styles
│   ├── index.css        # TailwindCSS imports
│   └── main.tsx         # App entry point
├── index.html
├── package.json
├── tailwind.config.js   # TailwindCSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Optional: Analytics
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Configuration Details

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | ✅ Yes | http://localhost:4000 |
| `VITE_GA_TRACKING_ID` | Google Analytics ID | ❌ No | - |

**Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client code.

---

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server (http://localhost:5173)
pnpm build            # Build for production
pnpm preview          # Preview production build locally

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler check

# Cleanup
pnpm clean            # Remove node_modules and build files
```

---

## 🎯 Features Deep Dive

### 1. 🧠 Natural Language Task Parser

The app includes an intelligent parser that understands natural language:

```
Input: "Meet Amy tomorrow 4pm urgent"

Parsed:
- Title: "Meet Amy"
- Due Date: Tomorrow at 4:00 PM
- Priority: High (urgent)
- Status: Pending
```

**Supported keywords:**
- **Priority**: urgent, important, low, medium, high
- **Time**: today, tomorrow, next week, [specific date]
- **Recurrence**: daily, weekly, monthly

### 2. 📊 Analytics Dashboard

Visual insights into your productivity:

- **Completion Rate** - Track your progress over time
- **Priority Distribution** - See how tasks are prioritized
- **Status Overview** - Pending vs completed tasks
- **Activity Timeline** - Task creation and completion trends

### 3. 🔐 Advanced Session Management

**Features:**
- View all active sessions across devices
- See device type, browser, OS, and IP address
- Last active timestamp for each session
- One-click session revocation
- "Sign Out All Other Devices" option
- Real-time session validation
- Automatic logout when session is revoked remotely

**Security Flow:**
```
User in Chrome: Revokes Edge session
    ↓
Backend: Deletes session from database
    ↓
Edge: Makes any API request
    ↓
Backend: Returns 401 "Session revoked"
    ↓
Edge: Shows alert → Redirects to login
```

### 4. 📱 Responsive Design

**Breakpoints:**
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

**Adaptive components:**
- Navigation collapses to hamburger menu on mobile
- Kanban board switches to vertical on tablet
- Task cards stack on small screens
- Session manager adjusts layout

---

## 🎨 Styling

### TailwindCSS Configuration

Custom theme extending TailwindCSS:

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      accent: 'hsl(var(--accent))',
      destructive: 'hsl(var(--destructive))',
    },
    animation: {
      'fadeIn': 'fadeIn 0.5s ease-in',
      'slideInRight': 'slideInRight 0.3s ease-out',
    }
  }
}
```

### Custom Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

### Glassmorphism Effect

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 🔄 State Management

### Local State with useState
```typescript
const [tasks, setTasks] = useState<Task[]>([])
const [isLoading, setIsLoading] = useState(true)
const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
```

### Form State with React Hook Form
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema)
})
```

### Authentication State
```typescript
// Stored in localStorage
localStorage.setItem('token', jwt)
localStorage.setItem('user', JSON.stringify(user))
```

---

## 🌐 API Integration

### API Configuration

```typescript
// src/config/api.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
  },
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id: string) => `/api/tasks/${id}`,
    DELETE: (id: string) => `/api/tasks/${id}`,
  },
  SESSIONS: {
    LIST: '/api/sessions',
    REVOKE: (id: string) => `/api/sessions/${id}`,
    REVOKE_ALL: '/api/sessions/revoke-all',
  },
}
```

### Error Handling

```typescript
export const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    const data = await response.json().catch(() => ({}))
    if (data.message?.includes('revoked')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      alert('Your session has been revoked from another device. Please sign in again.')
      window.location.href = '/auth/login'
    }
  }
  return response
}
```

---

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized build in the `dist/` directory.

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
netlify deploy --prod
```

#### GitHub Pages
```bash
# Add to package.json
"homepage": "https://username.github.io/repo-name"

# Deploy
pnpm build
gh-pages -d dist
```

### Environment Variables in Production

Set these in your deployment platform:
- `VITE_API_URL=https://your-api-domain.com`

---

## 🧪 Testing

The frontend uses **Vitest** and **React Testing Library** for comprehensive test coverage.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

```
src/__tests__/
├── App.test.tsx                    # Main app routing tests
├── home.test.tsx                   # Home page tests
├── profile.test.tsx                # Profile page tests
├── auth/
│   ├── login.test.tsx              # Login form tests
│   └── register.test.tsx           # Registration form tests
├── components/
│   ├── Layout.test.tsx             # Layout component tests
│   ├── navigation.test.tsx         # Navigation component tests
│   ├── task-list.test.tsx          # Task list component tests
│   ├── task-card.test.tsx          # Task card component tests
│   ├── create-task-modal.test.tsx  # Create task modal tests
│   ├── natural-language-parser.test.tsx  # NLP parser tests
│   ├── kanban-board.test.tsx       # Kanban board tests
│   ├── analytics-dashboard.test.tsx # Analytics dashboard tests
│   ├── session-manager.test.tsx    # Session management tests
│   └── task-header.test.tsx        # Task header tests
└── config/
    └── api.test.ts                 # API configuration tests
```

### Test Coverage

#### 🏠 **App Component** (`App.test.tsx`)
- ✅ Renders home page for root path (`/`)
- ✅ Renders home page for `/home` path
- ✅ Renders login page for `/auth/login` path
- ✅ Renders register page for `/auth/register` path
- ✅ Renders dashboard page for `/dashboard` path (with auth)
- ✅ Renders profile page for `/dashboard/profile` path (with auth)
- ✅ Renders home page for unknown paths (fallback)

#### 🏡 **Home Page** (`home.test.tsx`)
- ✅ Renders home page with title and description
- ✅ Displays sign in and create account buttons
- ✅ Redirects to dashboard if user is logged in
- ✅ Navigates to login when sign in button is clicked
- ✅ Navigates to register when create account button is clicked
- ✅ Displays feature cards (secure auth, fast & smooth, beautiful UI)
- ✅ Renders welcome message

#### 🔐 **Authentication**

**Login Page** (`auth/login.test.tsx`):
- ✅ Renders login form with email and password fields
- ✅ Shows validation error for invalid email
- ✅ Shows validation error for short password (< 6 characters)
- ✅ Submits form with valid data
- ✅ Displays error message on login failure
- ✅ Toggles password visibility
- ✅ Stores token and user in localStorage on successful login

**Register Page** (`auth/register.test.tsx`):
- ✅ Renders registration form with all required fields
- ✅ Shows validation error for short username (< 3 characters)
- ✅ Shows validation error for invalid email
- ✅ Shows validation error for short password (< 8 characters)
- ✅ Shows validation error when passwords don't match
- ✅ Submits form with valid data
- ✅ Displays error message on registration failure
- ✅ Toggles password visibility for both password fields
- ✅ Toggles confirm password visibility

#### 👤 **Profile Page** (`profile.test.tsx`)
- ✅ Redirects to login if no token
- ✅ Fetches and displays user profile
- ✅ Displays loading state
- ✅ Updates profile successfully
- ✅ Shows validation error for invalid email
- ✅ Changes password successfully
- ✅ Shows error when passwords do not match
- ✅ Toggles password visibility

#### 🧭 **Navigation Component** (`components/navigation.test.tsx`)
- ✅ Renders navigation with user info
- ✅ Renders navigation without user
- ✅ Toggles profile dropdown when clicked
- ✅ Closes dropdown when clicking outside
- ✅ Handles logout (clears localStorage)
- ✅ Navigates to dashboard when logo is clicked
- ✅ Displays user initial in avatar
- ✅ Handles user with empty username

#### 📋 **Task Components**

**Task List** (`components/task-list.test.tsx`):
- ✅ Renders task list with tasks
- ✅ Displays loading state
- ✅ Displays empty state when no tasks
- ✅ Calls onUpdateTask when task status is changed
- ✅ Calls onDeleteTask when delete button is clicked

**Task Card** (`components/task-card.test.tsx`):
- ✅ Renders task card with task details
- ✅ Renders completed task with strikethrough
- ✅ Shows edit form when isEditing is true
- ✅ Calls onCancel when cancel button is clicked
- ✅ Calls onUpdate when form is submitted with valid data
- ✅ Shows validation error for empty title
- ✅ Toggles task status when checkbox is clicked
- ✅ Calls onDelete when delete button is clicked
- ✅ Calls onEdit when edit button is clicked
- ✅ Formats date correctly
- ✅ Handles task without description

**Create Task Modal** (`components/create-task-modal.test.tsx`):
- ✅ Renders modal with form (title, description, priority, recurrence)
- ✅ Calls onClose when cancel button is clicked
- ✅ Calls onClose when backdrop is clicked
- ✅ Shows validation error for empty title
- ✅ Submits form with valid data
- ✅ Submits form with priority and recurrence
- ✅ Shows validation error for title exceeding max length (100 chars)
- ✅ Shows validation error for description exceeding max length (500 chars)
- ✅ Disables submit button while submitting

**Task Header** (`components/task-header.test.tsx`):
- ✅ Renders task header with counts
- ✅ Displays zero counts correctly
- ✅ Calls onCreateTask when button is clicked
- ✅ Displays all tasks completed message

#### 🧠 **Natural Language Parser** (`components/natural-language-parser.test.tsx`)
- ✅ Renders input field
- ✅ Parses task with high priority keyword ("urgent")
- ✅ Parses task with tomorrow date
- ✅ Parses task with today date
- ✅ Calls onTaskParsed when Add Task is clicked
- ✅ Clears input after adding task
- ✅ Does not show preview for empty input (spaces only)
- ✅ Disables button when isLoading is true
- ✅ Parses medium priority
- ✅ Parses low priority

#### 📊 **Kanban Board** (`components/kanban-board.test.tsx`)
- ✅ Renders kanban board with columns (To Do, In Progress, Done)
- ✅ Displays tasks in correct columns based on status
- ✅ Displays task counts in column headers
- ✅ Displays task priority badges
- ✅ Displays empty state when column has no tasks
- ✅ Calls onDeleteTask when delete button is clicked
- ✅ Displays task descriptions when available
- ✅ Handles tasks without descriptions
- ✅ Displays due dates when available
- ✅ Displays recurrence when available

#### 📈 **Analytics Dashboard** (`components/analytics-dashboard.test.tsx`)
- ✅ Renders analytics dashboard
- ✅ Displays correct task counts (total, completed, in progress, to do)
- ✅ Calculates completion rate correctly
- ✅ Displays high priority count
- ✅ Displays overdue count
- ✅ Displays created today count
- ✅ Handles empty tasks array
- ✅ Displays all stat cards
- ✅ Displays progress bar
- ✅ Does not count completed tasks as overdue

#### 🔒 **Session Manager** (`components/session-manager.test.tsx`)
- ✅ Renders session manager
- ✅ Displays loading state
- ✅ Displays sessions with device information
- ✅ Displays session stats (total devices, active now, other sessions)
- ✅ Handles revoke session
- ✅ Handles revoke all sessions
- ✅ Displays error message on fetch failure
- ✅ Marks current session

#### 🎨 **Layout Component** (`components/Layout.test.tsx`)
- ✅ Renders children
- ✅ Applies correct CSS classes
- ✅ Renders multiple children

#### ⚙️ **API Configuration** (`config/api.test.ts`)
- ✅ Returns correct URL with endpoint
- ✅ Handles endpoint without leading slash
- ✅ Uses default localhost URL when VITE_API_URL is not set
- ✅ Removes trailing slash from base URL
- ✅ Has correct auth endpoints (register, login, profile, update, password)
- ✅ Has correct task endpoints (list, create, update, delete)
- ✅ Has correct session endpoints (list, revoke, revoke-all)
- ✅ Returns response if status is not 401
- ✅ Handles revoked session (clears localStorage, redirects)
- ✅ Does not handle non-revoked 401 errors

### Test Statistics

- **Total Test Files**: 15
- **Test Categories**:
  - App & Routing: 1 file
  - Pages: 2 files (Home, Profile)
  - Authentication: 2 files (Login, Register)
  - Components: 10 files
  - Configuration: 1 file

### Testing Best Practices

1. **Isolation**: Each test is independent and cleans up after itself
2. **Mocking**: API calls and browser APIs are properly mocked
3. **Accessibility**: Tests use semantic queries (`getByRole`, `getByLabelText`)
4. **User Interactions**: Tests simulate real user behavior with `userEvent`
5. **Async Handling**: Proper use of `waitFor` for async operations
6. **Edge Cases**: Tests cover validation errors, empty states, and error scenarios

### Coverage Reports

Coverage reports are generated in `my-app/coverage/` directory after running:
```bash
pnpm test:coverage
```

The coverage report includes:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

---

## 🎯 Performance Optimization

### Implemented Optimizations

1. **Code Splitting** - Lazy load routes
2. **Image Optimization** - WebP format with fallbacks
3. **Bundle Size** - Tree-shaking unused code
4. **CSS Purging** - Remove unused TailwindCSS classes
5. **Caching** - Leverage browser caching

---

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
```
Error: Failed to fetch
```
**Solution**: Check `VITE_API_URL` in `.env` and ensure backend is running

**2. Session Not Revoking**
```
Session still active after revocation
```
**Solution**: Clear browser cache and localStorage, then refresh

**3. Build Fails**
```
Error: Cannot find module...
```
**Solution**: Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install`

**4. Styles Not Loading**
```
Tailwind classes not working
```
**Solution**: Ensure `index.css` imports TailwindCSS directives

---

## 📝 Coding Standards

### TypeScript
- Use explicit types for all functions
- Avoid `any` type
- Use interfaces for object shapes

### React
- Functional components with hooks
- Props destructuring
- Meaningful component names

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Pages: `index.tsx` in folders

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review Checklist
- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] TypeScript types are properly defined
- [ ] Components are properly documented
- [ ] Responsive design works on all screen sizes

---

<div align="center">
  
  **⭐ Star this repo if you find it helpful!**
  
  Made with ❤️ and ☕
  
</div>
