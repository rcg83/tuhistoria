import type { ButtonHTMLAttributes } from 'react';
import './StoryButton.scss';

interface StoryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export const StoryButton = ({
  className = '',
  children,
  ...rest
}: StoryButtonProps) => {
  return (
    <button
      className={`story-button ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};
