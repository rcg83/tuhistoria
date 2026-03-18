import { Navbar } from '../navbar/Navbar';
import './MainLayout.scss';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-layout">
      <Navbar />
      
      <main className="content-area">
        {children}
      </main>

      <Navbar />
    </div>
  );
};
