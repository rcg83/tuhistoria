import { Leftbar } from '../sidebars/Leftbar.tsx';
import { Rightbar } from '../sidebars/Rightbar.tsx';
import './MainLayout.scss';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="main-layout">
      <Leftbar />
      
      <main className="content-area">
        {children}
      </main>

      <Rightbar />
    </div>
  );
};
