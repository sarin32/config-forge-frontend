import {ProjectDetailView} from '@/pages/project-detail';
import {Projects} from '@/pages/projects';
import {Navigate, Route, Routes} from 'react-router-dom';

export function DashboardRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="project" replace />} />
      <Route path="/project" element={<Projects />}></Route>
      <Route path="/project/:projectId" element={<ProjectDetailView />}></Route>
    </Routes>
  );
}
