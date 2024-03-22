import {useParams} from 'react-router-dom';
import {CreateEnvironment} from './create-environment';
import {projectService} from '@/api/project.service';
import {useEffect} from 'react';

export function ProjectDetailView() {
  const {projectId} = useParams();

  const fetchProjectDataInDetail = async () => {
    if (!projectId) return;
    const response = await projectService.getProjectDataInDetail({projectId});

    // if(!response.ok) return

    console.log(response);
  };
  useEffect(() => {
    fetchProjectDataInDetail();
  }, []);

  return (
    <>
      {projectId && (
        <CreateEnvironment
          projectId={projectId}
          environmentCreated={() => {}}
        ></CreateEnvironment>
      )}
    </>
  );
}
