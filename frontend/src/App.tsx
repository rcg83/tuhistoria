import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { httpAuthApi } from './modules/auth/infrastructure/api/httpAuthApi';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
import { BookWrapper } from './components/layout/BookWrapper';
import { LoginForm } from './features/auth/components/LoginForm';
import { Home } from './pages/home/Home';

export const App = () => {
  return (
    <AuthProvider api={httpAuthApi}>
      <Routes>
        <Route 
          path='/login' 
          element={
            <BookWrapper 
              leftPage={<div className="book__cover">MERN Project</div>}
              rightPage={<LoginForm />}
            />
          } 
        />

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
