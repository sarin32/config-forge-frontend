import {Projects} from '@/pages/projects';
import {Route, Routes} from 'react-router-dom';

export function DashboardRoute() {
  return (
    <Routes>
      <Route path="/" element={<Projects />}></Route>
    </Routes>
  );
}
