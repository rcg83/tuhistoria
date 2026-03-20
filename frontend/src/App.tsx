
import { useEffect } from 'react';
import { checkAPI } from './api/api.ts';
import { MainLayout } from './components/layout/MainLayout.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { BookWrapper } from './components/bookWrapper/BookWrapper.tsx';

const App = () => {

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <MainLayout>
      <BookWrapper />
      <Footer />
    </MainLayout>
  );
}

export default App;