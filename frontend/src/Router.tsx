import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { WelcomePage } from './pages/Welcome.page';
import { RegisterPage } from './pages/Register.page';
import { DashboardPage } from './pages/Dashboard.page';
import { TargetsPage } from './pages/Targets.page';
import { ScansPage } from './pages/Scans.page';
import { SettingsPage } from './pages/Settings.page';
import { UsersPage } from './pages/Users.page';
import { NotFoundPage } from './pages/NotFound.page';
import { ProtectedRoute } from './components/ProtectedRoute';

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
    element: <ProtectedRoute />,
    children: [
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
            element: <ProtectedRoute allowedRoles={['Admin']} />,
            children:[
              {
                path: 'users',      
                element: <UsersPage />,
              },
            ]
          },
  
          {
            path: '*',
            element: <NotFoundPage />
          },
        ]
      },
    ]
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
