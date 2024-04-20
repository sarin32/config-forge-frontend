import {useParams} from 'react-router-dom';
import {CreateEnvironment} from '../environments/create-environment';
import {projectService} from '@/api/project.service';
import {useEffect, useState} from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {CreateOrUpdateVariable} from '../variables/create-or-update-variable';
import {DeleteVariable} from '../variables/delete-variable';

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

  const handleEnvironmentCreated = () => {
    fetchProjectDataInDetail();
  };

  const CreateEnvironmentObject = () => {
    return (
      <CreateEnvironment
        projectId={projectId}
        environmentCreated={handleEnvironmentCreated}
      ></CreateEnvironment>
    );
  };

  const getVariable = (envId: string, variableKey: string) => {
    return variableData[variableKey].find(
      variable => variable.environmentId == envId
    );
  };

  const closeFromVariableUpdates = (varUpdatesPresent: boolean): void => {
    if (!varUpdatesPresent) return;
    fetchProjectDataInDetail();
  };

  return (
    <div className="m-5">
      <div className="flex justify-between">
        <h2>{projectData.name}</h2>

        <CreateEnvironmentObject />
      </div>

      {environmentData.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Key</TableHead>

              {environmentData.map(env => {
                return (
                  <TableHead key={env.id} className="">
                    <div className="flex items-center">{env.name}</div>
                  </TableHead>
                );
              })}
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(variableData).map(variableKey => {
              return (
                <TableRow key={variableKey}>
                  <TableCell className="font-medium">{variableKey}</TableCell>

                  {environmentData.map(env => {
                    return (
                      <TableCell
                        key={env.id}
                        className="parent-hover font-medium"
                      >
                        <div className="flex justify-between">
                          {getVariable(env.id, variableKey)?.value}
                          <DeleteVariable
                            variableId={
                              getVariable(env.id, variableKey)?.id || ''
                            }
                            deleted={fetchProjectDataInDetail}
                          ></DeleteVariable>
                        </div>
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <CreateOrUpdateVariable
                      close={closeFromVariableUpdates}
                      mode="edit"
                      keyValue={variableKey}
                      variableData={environmentData.map(env => {
                        const variable = getVariable(env.id, variableKey);
                        return {
                          environmentId: env.id,
                          environmentName: env.name,
                          value: variable?.value || '',
                          variableId: variable?.id || null,
                        };
                      })}
                    ></CreateOrUpdateVariable>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableCaption>
            <CreateOrUpdateVariable
              close={closeFromVariableUpdates}
              mode="create"
              variableData={environmentData.map(env => {
                return {
                  environmentId: env.id,
                  environmentName: env.name,
                  value: '',
                  variableId: null,
                };
              })}
            />
          </TableCaption>
        </Table>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          Start Creating Environments
          <div className="m-4">
            <CreateEnvironmentObject />
          </div>
        </div>
      )}
    </div>
  );
}
