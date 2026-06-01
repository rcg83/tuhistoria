import { BookWrapper } from 'src/components/layout/BookWrapper';
import './AchievementsPage.scss';

const achievements = [
  { letter: 'B', title: 'Bienvenido', desc: 'Regístrate en la plataforma', unlocked: true },
  { letter: 'P', title: 'Primera historia', desc: 'Escribe tu primera historia', unlocked: true },
  { letter: 'E', title: 'Escritor', desc: 'Envía 100 mensajes', unlocked: false },
  { letter: 'L', title: 'Lector voraz', desc: 'Lee 10 historias completas', unlocked: false },
  { letter: 'R', title: 'Racha', desc: 'Inicia sesión 7 días seguidos', unlocked: false },
  { letter: 'S', title: 'Social', desc: 'Comparte una historia', unlocked: false },
];

export const AchievementsPage = () => {
  return (
    <BookWrapper
      hideLeftOnMobile
      leftPage={
        <div className="ach-left">
          <h2 className="ach-left__title">Logros</h2>
          <p className="ach-left__desc">Desbloquea logros mientras escribes tus historias</p>
        </div>
      }
      rightPage={
        <div className="ach-page">
          <div className="ach-page__banner">
            <span className="ach-page__crown">♛</span>
            <span>Solo para cuentas Premium</span>
          </div>
          <div className="ach-page__grid">
            {achievements.map((a, i) => (
              <div key={i} className={`ach-card${a.unlocked ? ' ach-card--unlocked' : ''}`}>
                <div className="ach-card__icon">
                  <span className="ach-card__letter">{a.letter}</span>
                </div>
                <div className="ach-card__info">
                  <span className="ach-card__title">{a.title}</span>
                  <span className="ach-card__desc">{a.desc}</span>
                </div>
                {a.unlocked && <span className="ach-card__badge">✓</span>}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
};
