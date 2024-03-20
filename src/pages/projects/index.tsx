import {useState, useEffect} from 'react';
import {CreateProject} from './create-project';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {GetProjectListResult, projectService} from '@/api/project.service';
import {formatDateToIST} from '@/lib/utils';

export function Projects() {
  const [projectList, setProjectList] = useState([] as GetProjectListResult);

  const fetchProjects = async () => {
    const response = await projectService.getProjetList();
    if (!response.ok) {
      return;
    }
    setProjectList(response.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <CreateProject />

      {/* Map through the projectList array and render project cards */}
      {projectList.map(project => (
        <Card key={project.projectId}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>
              {project.environmentCount} Environments
            </CardDescription>
          </CardHeader>
          <CardFooter>
            {formatDateToIST(new Date(project.createdAt))}
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
