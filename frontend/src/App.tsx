import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext.tsx';
import { httpAuthApi } from './modules/auth/infrastructure/api/httpAuthApi.ts';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { BookLayout } from './components/bookWrapper/BookLayout.tsx';
import { Home } from './pages/home/Home';

export const App = () => {
  return (
    <AuthProvider api={httpAuthApi}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route element={<BookLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path='home' element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
