import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';
import { BookWrapper } from 'src/components/layout/BookWrapper';
import './Home.scss';

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToMyStories = () => navigate('/my-stories');

  return (
    <BookWrapper
      hideLeftOnMobile
      leftPage={
        <div className="home-left" onClick={goToMyStories}>
          <img className="home-left__image" src="/images/biblioteca.png" alt="Biblioteca" />
        </div>
      }
      rightPage={
        <div className="home-content">
          <h1>Bienvenido a tu historia, {user?.username}</h1>
          <div className="home-content__image-wrapper" onClick={goToMyStories}>
            <img className="home-content__image" src="/images/interior.png" alt="Interior" />
            <span className="home-content__cta">Toca para empezar una nueva historia</span>
          </div>
        </div>
      }
    />
  );
};
