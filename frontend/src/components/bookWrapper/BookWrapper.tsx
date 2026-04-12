import { type ReactNode } from 'react';
import './BookWrapper.scss';

type BookProps = {
  leftPage?: ReactNode;
  rightPage?: ReactNode;
}

export const BookWrapper = ({leftPage, rightPage}: BookProps) => {
  return (
    <div className='book'>
      <div className='book__page book__page--left'>{leftPage}</div>
      <div className='book__spine'></div>
      <div className='book__page book__page--right'>{rightPage}</div>
    </div>
  );
}
