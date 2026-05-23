import { type ReactNode } from 'react';
import './BookWrapper.scss';

type BookProps = {
  leftPage?: ReactNode;
  rightPage?: ReactNode;
}

export const BookWrapper = ({ leftPage, rightPage }: BookProps) => {
  return (
    <div className='book'>
      <div className='book__page book__page--left'>
        <div className='book__content book__content--left'>
          {leftPage}
        </div>
      </div>
      <div className='book__page book__page--right'>
        <div className='book__content book__content--right'>
          {rightPage}
        </div>
      </div>
    </div>
  );
}
