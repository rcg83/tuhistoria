import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { checkAPI } from './api/api.ts';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { BookWrapper } from './components/bookWrapper/BookWrapper.tsx';

const App = () => {

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>
        <Route index element={<BookWrapper />} />
      </Route>
    </Routes>
  );
}

export default App;