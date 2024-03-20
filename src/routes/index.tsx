import {DashboardLayout} from '@/layouts/dashboard.layout';
import {HomeLayout} from '@/layouts/home.layout';
import {Route, Routes} from 'react-router-dom';

export function RootRoutes() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardLayout />}></Route>
      <Route path="/*" element={<HomeLayout />}></Route>
    </Routes>
  );
}
