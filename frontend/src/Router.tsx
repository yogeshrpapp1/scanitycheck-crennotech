import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { WelcomePage } from './pages/Welcome.page';
import { RegisterPage } from './pages/Register.page';
import { DashboardPage } from './pages/Dashboard.page';
import { TargetsPage } from './pages/Targets.page';
import { ScansPage } from './pages/Scans.page';
import { SettingsPage } from './pages/Settings.page';
import { UsersPage } from './pages/Users.page';

const router = createBrowserRouter([
  // Path WITHOUT Navbar
  {
    path: '/',
    element: <WelcomePage />,
    
  },
  {
    path: '/register',
    element: <RegisterPage />,
    
  },

  // Paths WITH Navbar
  {
    element: <Layout />,
    children: [
      {
        path: 'dashboard',      
        element: <DashboardPage />,
      },
      {
        path: 'targets',      
        element: <TargetsPage />,
      },
      {
        path: 'scans',      
        element: <ScansPage />,
      },
      {
        path: 'settings',      
        element: <SettingsPage />,
      },
      {
        path: 'users',      
        element: <UsersPage />,
      },
    ]
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
