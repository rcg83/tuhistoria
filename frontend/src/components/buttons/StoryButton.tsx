import type { ButtonHTMLAttributes } from 'react';
import './StoryButton.scss';

interface StoryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'solid';
}

export const StoryButton = ({
  variant = 'solid',
  className = '',
  children,
  ...rest
}: StoryButtonProps) => {
  return (
    <button
      className={`story-button story-button--${variant} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
};
