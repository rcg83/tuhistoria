import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { httpAuthApi } from './modules/auth/infrastructure/api/httpAuthApi';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
import { BookBackground } from './components/layout/BookBackground';
import { LoginPage } from './pages/login/LoginPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTemplatesPage } from './pages/admin/AdminTemplatesPage';
import { AchievementsPage } from './pages/achievements/AchievementsPage';
import { Footer } from './components/footer/Footer';
import { Home } from './pages/home/Home';
import { StoriesPage } from './pages/stories/StoriesPage';
import { MyStoriesPage } from './pages/stories/MyStoriesPage';
import { StoryPage } from './pages/story/StoryPage';

import './App.scss';

export const App = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <AuthProvider api={httpAuthApi}>
      <div className="app-root">
        <BookBackground closed={isLogin} />
        <Footer text="Proyecto DAW - tuhistoria - Ramón Céspedes" />
        <Routes>
          <Route path='/login' element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path='home' element={<Navigate to="/" replace />} />
              <Route path='stories' element={<StoriesPage />} />
              <Route path='my-stories' element={<MyStoriesPage />} />
              <Route path='profile' element={<ProfilePage />} />
              <Route path='users' element={<AdminUsersPage />} />
              <Route path='templates' element={<AdminTemplatesPage />} />
              <Route path='achievements' element={<AchievementsPage />} />
              <Route path='story/:id' element={<StoryPage />} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};
