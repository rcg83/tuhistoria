import { useEffect } from 'react';
import { checkAPI } from './api/api.ts';
import { Navbar } from './components/navbar/Navbar.tsx';

const App = () => {

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <>
      <Navbar appName='tuhistoria' />
    </>
  );
}

export default App;