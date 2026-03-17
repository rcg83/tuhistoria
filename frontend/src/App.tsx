import { useEffect } from 'react';
import { checkAPI } from './api/api.ts';
import { Navbar } from './components/navbar/Navbar.tsx';
import { Footer } from './components/footer/Footer.tsx';
import { BookWrapper } from './components/bookWrapper/BookWrapper.tsx';

const App = () => {

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <>
      <Navbar />
      <BookWrapper />
      <Footer />
    </>
  );
}

export default App;