import {Home} from '@/pages/home';
import {Login} from '@/pages/login';
import {Signup} from '@/pages/signup';
import {Route, Routes} from 'react-router-dom';

export function HomeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
    </Routes>
  );
}
