import {variableService} from '@/api/variable.service';
import {Button} from '@/components/ui/button';
import {Trash2} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {useToast} from '@/components/ui/use-toast';

export function DeleteVariable({
  variableId,
  deleted,
}: {
  variableId: string;
  deleted?: () => {};
}) {
  const {toast} = useToast();

  const deleteVariable = async () => {
    const response = await variableService.deleteVariable({variableId});
    if (!response.ok) {
      toast({
        variant: 'destructive',
        title: 'Variable Deletion failed',
        description: `Reason: ${response.data.message}`,
      });
      return;
    }
    toast({
      title: 'Variable Deleted successfully',
    });
    if (deleted) deleted();
  };

  if (!variableId) return;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={'ghost'}
          className="hover:opacity-100 opacity-0 parent-hover-full-opacity"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            variable from the environment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteVariable}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
