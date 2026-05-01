import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext.tsx';
import { httpAuthApi } from './modules/infrastructure/api/httpAuthApi.ts';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { BookLayout } from './components/bookWrapper/BookLayout.tsx';

const App = () => {
  return (
    <AuthProvider api={httpAuthApi}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<BookLayout />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
