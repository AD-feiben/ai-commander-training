import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const isTutorialPage = location.pathname.startsWith('/tutorial');

  if (isTutorialPage) {
    return <Outlet />;
  }

  return (
    <Outlet />
  );
}
