import {DashboardRoute} from '@/routes/dashboard.route';
import {Link} from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar/Navigation */}
      <aside className="bg-primary text-primary-foreground w-64">
        <div className="py-4 px-6">
          <h2 className="text-2xl font-bold mb-4">
            <Link to={'/'}>ConfigForge</Link>
          </h2>
          <nav>
            <ul>
              <li className="mb-2">
                <Link
                  className="block text-secondary-foreground hover:text-accent"
                  to={''}
                >
                  Projects
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <DashboardRoute />
      </main>
    </div>
  );
};
