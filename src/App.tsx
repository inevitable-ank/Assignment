import Home from './home'
import LoginPage from './auth/login'
import RegisterPage from './auth/register'
import DashboardPage from './dashboard'
import ProfilePage from './profile'
import Layout from './components/Layout'
import './App.css'

function App() {
  // Read pathname directly since window.location.href causes full page reload
  const currentPath = window.location.pathname

  // Render the appropriate component based on the current path
  const renderPage = () => {
    switch (currentPath) {
      case '/':
      case '/home':
        return <Home />
      case '/auth/login':
        return <LoginPage />
      case '/auth/register':
        return <RegisterPage />
      case '/dashboard':
        return <DashboardPage />
      case '/dashboard/profile':
        return <ProfilePage />
      default:
        // If path doesn't match, redirect to home
        return <Home />
    }
  }

  return (
    <Layout>
      {renderPage()}
    </Layout>
  )
}

export default App
