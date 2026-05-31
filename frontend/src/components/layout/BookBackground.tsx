import './BookBackground.scss';

type Props = { closed?: boolean };

export const BookBackground = ({ closed }: Props) => (
  <div className="book-bg">
    <div className={`book-bg__track${closed ? ' book-bg__track--closed' : ''}`}>
      {closed ? (
        <div className="book-bg__page book-bg__page--single" />
      ) : (
        <>
          <div className="book-bg__page book-bg__page--left" />
          <div className="book-bg__page book-bg__page--right" />
        </>
      )}
    </div>
  </div>
);
