import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
