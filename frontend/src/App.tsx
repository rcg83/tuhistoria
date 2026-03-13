import { useEffect } from "react";
import checkAPI from './api/api.ts';

const App = () => {

  useEffect(() => {
    checkAPI();
  }, []);

  return (
    <>
      <h1>tuhistoria Frontend</h1>
    </>
  );
}

export default App;