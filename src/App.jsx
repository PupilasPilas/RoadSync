import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ItemDetail from './pages/ItemDetail'
import Scan from './pages/Scan'
import Trucks from './pages/Trucks'
import TruckDetail from './pages/TruckDetail'
import Users from './pages/Users'

function RoleRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<RoleRoute><Dashboard /></RoleRoute>} />
      <Route path="/inventory" element={<RoleRoute><Inventory /></RoleRoute>} />
      <Route path="/item/:id" element={<RoleRoute><ItemDetail /></RoleRoute>} />
      <Route path="/scan" element={<RoleRoute allowedRoles={['dept-lead', 'load-lead']}><Scan /></RoleRoute>} />
      <Route path="/trucks" element={<RoleRoute allowedRoles={['admin', 'load-lead']}><Trucks /></RoleRoute>} />
      <Route path="/truck/:id" element={<RoleRoute allowedRoles={['admin', 'load-lead']}><TruckDetail /></RoleRoute>} />
      <Route path="/users" element={<RoleRoute allowedRoles={['admin']}><Users /></RoleRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
