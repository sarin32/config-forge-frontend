import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {ManageVariableForm} from './manage-variables-form';
import {AddKeyForm} from './add-key-form';

export function AddVariable({
  environmentData,
}: {
  environmentData: {
    id: string;
    name: string;
  }[];
}) {
  const [isKeyCreated, setIsKeyCreated] = useState(false);
  const [key, setKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const keyCreated = (key: string) => {
    setKey(key);
    setIsKeyCreated(true);
  };

  const backFromManage = () => {
    setIsKeyCreated(false);
  };

  const getVariableData = () => {
    return environmentData.map(env => {
      return {
        variableId: null,
        value: '',
        environmentId: env.id,
        environmentName: env.name,
      };
    });
  };

  return (
    <AlertDialog open={isModalOpen}>
      <Button onClick={openModal}> Add Variable </Button>
      <AlertDialogContent>
        {isKeyCreated ? (
          <>
            <AlertDialogTitle>Manage Variables</AlertDialogTitle>
            <ManageVariableForm
              close={closeModal}
              keyValue={key}
              variableData={getVariableData()}
              back={backFromManage}
            ></ManageVariableForm>
          </>
        ) : (
          <>
            <AlertDialogTitle>Add Variables</AlertDialogTitle>
            <AddKeyForm
              cancel={closeModal}
              proceed={keyCreated}
              defaultKey={key}
            ></AddKeyForm>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
