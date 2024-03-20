import {ModeToggle} from '@/components/mode-toggle';
import {HomeRoutes} from '@/routes/home.route';
import {Link} from 'react-router-dom';

export function HomeLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-accent text-secondary-foreground py-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-secondary-foreground">
            ConfigForge
          </h1>
          {/* Navigation links can be added here */}
          <nav className="mt-2">
            <ul className="flex justify-end">
              <li className="mr-4">
                <Link className="hover:text-popover" to={'/'}>
                  Home
                </Link>
              </li>
              <li className="mr-4">
                <Link className="hover:text-popover" to={'/signup'}>
                  SignUp
                </Link>
              </li>
              <li className="mr-4">
                <Link className="hover:text-popover" to={'/login'}>
                  Login
                </Link>
              </li>
              <li>
                <ModeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-8">
        <HomeRoutes />
      </main>

      {/* Footer */}
      <footer className="bg-primary py-4">
        <div className="container mx-auto text-center">
          <p className="text-primary-foreground">
            &copy; 2024 ConfigForge. All rights reserved.
          </p>
          {/* Additional footer content or links can be added here */}
        </div>
      </footer>
    </div>
  );
}
