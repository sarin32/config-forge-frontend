import {useParams} from 'react-router-dom';
import {CreateEnvironment} from './create-environment';
import {projectService} from '@/api/project.service';
import {useEffect, useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function ProjectDetailView() {
  const {projectId} = useParams();
  const [variableData, setVariableData] = useState(
    {} as Record<
      string,
      {value: string; isOverride: boolean; id: string; environmentId: string}[]
    >
  );
  const [environmentData, setenvironmentData] = useState(
    [] as {id: string; name: string}[]
  );
  const [projectData, setProjectData] = useState({
    createdAt: '',
    id: '',
    name: '',
  });

  if (!projectId) return;

  const fetchProjectDataInDetail = async () => {
    const response = await projectService.getProjectDataInDetail({projectId});

    if (!response.ok) return;

    const tempVariableData: typeof variableData = {};
    const tempEnvironments: typeof environmentData = [];

    for (const environment of response.data.environments) {
      for (const variable of environment.variables) {
        const varibleValue = tempVariableData[variable.key] || [];

        varibleValue.push({
          value: variable.value,
          isOverride: variable.isOverride,
          id: variable.id,
          environmentId: environment.id,
        });

        tempVariableData[variable.key] = varibleValue;
      }

      tempEnvironments.push({
        id: environment.id,
        name: environment.environmentName,
      });
    }
    setenvironmentData(tempEnvironments);
    setVariableData(tempVariableData);
    setProjectData({
      createdAt: response.data.createdAt,
      id: response.data.id,
      name: response.data.name,
    });
  };

  useEffect(() => {
    fetchProjectDataInDetail();
  }, []);

  return (
    <>
      <CreateEnvironment
        projectId={projectId}
        environmentCreated={() => {}}
      ></CreateEnvironment>

      <h2>{projectData.name}</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Key</TableHead>

            {environmentData.map(env => {
              return (
                <TableHead key={env.id} className="">
                  {env.name}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.keys(variableData).map(variableKey => {
            return (
              <TableRow key={variableKey}>
                <TableCell className="font-medium">{variableKey}</TableCell>

                {environmentData.map(env => {
                  return (
                    <TableCell key={env.id} className="font-medium">
                      {
                        variableData[variableKey].find(
                          variable => variable.environmentId == env.id
                        )?.value
                      }
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
