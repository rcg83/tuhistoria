import { Outlet } from 'react-router-dom';
import { Leftbar } from '../sidebars/Leftbar.tsx';
import { Rightbar } from '../sidebars/Rightbar.tsx';
import './MainLayout.scss';

export const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="main-layout__left">
        <Leftbar />
      </div>
      
      <main className="content-area">
        <Outlet />
      </main>

      <div className="main-layout__right">
        <Rightbar />
      </div>
    </div>
  );
};
