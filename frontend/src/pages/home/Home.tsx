import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/layout/BookWrapper';

export const Home = () => {
  const { user } = useAuth();

  return (
    <BookWrapper
      rightPage={
        <div className="home-content">
          <h1>Bienvenido a tu historia, {user?.username}</h1>
        </div>
      }
    />
  );
};
