import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext.tsx';
import { httpAuthApi } from './modules/infrastructure/api/httpAuthApi.ts';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { BookHome } from './components/bookWrapper/BookHome.tsx';

const App = () => {
  return (
    <AuthProvider api={httpAuthApi}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<BookHome />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
