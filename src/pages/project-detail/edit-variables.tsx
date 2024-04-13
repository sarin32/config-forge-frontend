import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {ManageVariableForm} from './manage-variables-form';
import {Pencil} from 'lucide-react';

export function EditVariables({
  keyValue,
  variableData,
}: {
  keyValue: string;
  variableData: {
    variableId: string | null;
    value: string;
    environmentId: string;
    environmentName: string;
  }[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AlertDialog open={isModalOpen}>
      <Button onClick={openModal} variant={'ghost'}>
        <Pencil size={16} />
      </Button>
      <AlertDialogContent>
        <AlertDialogTitle>Edit Variables</AlertDialogTitle>
        <ManageVariableForm
          close={closeModal}
          keyValue={keyValue}
          variableData={variableData}
        ></ManageVariableForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
