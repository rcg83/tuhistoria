import { type ReactNode } from 'react';
import './BookWrapper.scss';

type BookProps = {
  leftPage?: ReactNode;
  rightPage?: ReactNode;
  singlePage?: boolean;
}

export const BookWrapper = ({ leftPage, rightPage, singlePage }: BookProps) => {
  return (
    <div className={`book${singlePage ? ' book--single' : ''}`}>
      {!singlePage && (
        <div className='book__page book__page--left'>
          <div className='book__content book__content--left'>
            {leftPage}
          </div>
        </div>
      )}
      <div className='book__page book__page--right'>
        <div className='book__content book__content--right'>
          {rightPage}
        </div>
      </div>
    </div>
  );
}
