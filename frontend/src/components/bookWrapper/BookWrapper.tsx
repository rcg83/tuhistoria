import { type ReactNode } from 'react';
import './BookWrapper.scss';

type BookProps = {
  leftPage?: ReactNode;
  rightPage?: ReactNode;
}

export const BookWrapper = ({leftPage, rightPage}: BookProps) => {
  return (
    <div className='bookwrapper-container'>
      <div className='left-page'>{leftPage}</div>
      <div className='book-spine'></div>
      <div className='right-page'>{rightPage}</div>
    </div>
  );
}