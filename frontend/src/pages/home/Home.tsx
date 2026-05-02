import { BookWrapper } from '../../components/bookWrapper/BookWrapper';

export const Home = () => {
  return (
    <BookWrapper 
      leftPage={
        <div className="home-sidebar">
          <h2>Panel de Control</h2>
        </div>
      }
      rightPage={
        <div className="home-content">
          <h1>Bienvenido</h1>
        </div>
      }
    />
  );
};
