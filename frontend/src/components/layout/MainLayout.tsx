import { Outlet } from 'react-router-dom';
import { Leftbar } from '../sidebars/Leftbar.tsx';
import { Rightbar } from '../sidebars/Rightbar.tsx';
import { Footer } from '../footer/Footer.tsx';
import './MainLayout.scss';

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <Leftbar />
      <main className="content-area">
        <Outlet />
        <Footer />
      </main>
      <Rightbar />
    </div>
  );
};