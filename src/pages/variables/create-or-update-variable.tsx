import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {ManageVariableForm} from './manage-variables-form';
import {AddKeyForm} from './add-key-form';
import {Pencil} from 'lucide-react';

export function CreateOrUpdateVariable({
  variableData: variableDataInput,
  mode,
  keyValue,
  close,
}: {
  keyValue?: string;
  mode: 'edit' | 'create';
  variableData: {
    variableId: string | null;
    value: string;
    environmentId: string;
    environmentName: string;
  }[];
  close: (varUpdatesPresent: boolean) => void;
}) {
  const [isKeyCreated, setIsKeyCreated] = useState(mode === 'edit');
  const [key, setKey] = useState(keyValue || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variableData, setVariableData] = useState(variableDataInput);
  const [showBack, setShowBack] = useState(mode === 'create');
  const [variableUpdatesPresent, setVariableUpdatesPresent] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    close(variableUpdatesPresent);
  };

  const keyCreated = (key: string) => {
    setKey(key);
    setIsKeyCreated(true);
  };

  let backFromManage = () => {
    setIsKeyCreated(false);
  };

  const variableUpdates = ({
    variableId,
    value,
    environmentId,
  }: {
    variableId: string;
    value: string;
    environmentId: string;
  }): void => {
    const envObjIndex = variableData.findIndex(
      variable => variable.environmentId === environmentId
    );
    if (envObjIndex === -1) return;
    const envObj = variableData[envObjIndex];
    envObj.variableId = variableId;
    envObj.value = value;
    variableData[envObjIndex] = {...envObj};
    setVariableData([...variableData]);
    setShowBack(false);
    setVariableUpdatesPresent(true);
  };

  return (
    <AlertDialog open={isModalOpen}>
      {mode === 'create' ? (
        <Button onClick={openModal}> Add Variable </Button>
      ) : (
        <Button onClick={openModal} variant={'ghost'}>
          <Pencil size={16} />
        </Button>
      )}

      <AlertDialogContent>
        {isKeyCreated ? (
          <>
            <AlertDialogTitle>Manage Variables</AlertDialogTitle>
            <ManageVariableForm
              close={closeModal}
              keyValue={key}
              variableData={variableData}
              back={showBack ? backFromManage : undefined}
              variableUpdates={variableUpdates}
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
