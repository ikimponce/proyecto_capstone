import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'

import Login from './pages/Login'
import Protected from './components/Protected';
import AdminGamesPage from './pages/AdminGamesPage';
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateGroup from './pages/CreateGroup'
import GroupChat from './pages/GroupChat'
import HomePage from './pages/HomePage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
        {user && <Navbar />}

        <main className={user ? 'pt-16' : ''}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/group/create" element={user ? <CreateGroup /> : <Navigate to="/login" />} />
            <Route path="/group/:id" element={user ? <GroupChat /> : <Navigate to="/login" />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/homepage"} />} />
            <Route path="*" element={<Navigate to="/homepage" />} />
            <Route path="/admin/games"element={<Protected requireAdmin={true}><AdminGamesPage /></Protected>}/>
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App