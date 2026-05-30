import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { httpAuthApi } from './modules/auth/infrastructure/api/httpAuthApi';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './features/auth/guards/ProtectedRoute';
import { BookWrapper } from './components/layout/BookWrapper';
import { LoginForm } from './features/auth/components/LoginForm';
import { Home } from './pages/home/Home';
import { StoriesPage } from './pages/stories/StoriesPage';
import { MyStoriesPage } from './pages/stories/MyStoriesPage';
import { StoryPage } from './pages/story/StoryPage';

export const App = () => {
  return (
    <AuthProvider api={httpAuthApi}>
      <Routes>
        <Route 
          path='/login' 
          element={
            <BookWrapper 
              singlePage
              rightPage={<LoginForm />}
            />
          } 
        />

        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Navigate to="/" replace />} />
            <Route path='stories' element={<StoriesPage />} />
            <Route path='my-stories' element={<MyStoriesPage />} />
            <Route path='story/:id' element={<StoryPage />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
