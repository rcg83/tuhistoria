import { BookWrapper } from 'src/components/layout/BookWrapper';
import { LoginForm } from 'src/features/auth/components/LoginForm';

export const LoginPage = () => {
  return (
    <BookWrapper
      singlePage
      rightPage={<LoginForm />}
    />
  );
};
