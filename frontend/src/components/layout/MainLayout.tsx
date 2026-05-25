import { Outlet } from 'react-router-dom';
import { Leftbar } from '../sidebars/Leftbar.tsx';
import { Rightbar } from '../sidebars/Rightbar.tsx';
import { AppBar } from './AppBar';
import { StoriesProvider } from '../../features/stories/context/StoriesContext';
import './MainLayout.scss';

export const MainLayout = () => {
  return (
    <StoriesProvider>
      <div className="main-layout">
        <AppBar />

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
    </StoriesProvider>
  );
};
