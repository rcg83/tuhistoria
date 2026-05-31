import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import './Home.scss';

export const Home = () => {
  const { user } = useAuth();

  return (
    <BookWrapper
      leftPage={
        <div className="home-left">
          <img className="home-left__image" src="/images/interior.png" alt="Interior" />
        </div>
      }
      rightPage={
        <div className="home-content">
          <h1>Bienvenido a tu historia, {user?.username}</h1>
        </div>
      }
    />
  );
};
