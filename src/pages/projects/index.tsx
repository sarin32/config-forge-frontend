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
import {EditProject} from './edit-project';
import {Link} from 'react-router-dom';

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
      <div className="flex justify-end  m-7">
        <CreateProject projectCreated={fetchProjects} />
      </div>
      <div className="grid flex-wrap justify-around gap-5 m-5 lg:grid-cols-3 md:grid-cols-2">
        {/* Map through the projectList array and render project cards */}
        {projectList.map(project => (
          <Card key={project.projectId} className="flex-auto">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <Link to={project.projectId}>{project.name}</Link>
                <EditProject project={project} projectEdited={fetchProjects} />
              </CardTitle>

              <CardDescription>
                {project.environmentCount} Environments
              </CardDescription>
            </CardHeader>
            <CardFooter>
              {formatDateToIST(new Date(project.createdAt))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
