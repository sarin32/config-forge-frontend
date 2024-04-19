import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {environmentService} from '@/api/environment.service';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {message: 'Environment Name must be at least 2 characters.'})
    .max(16, {message: 'Environment Name can not be more than 16 characters.'}),
});

export function CreateEnvironment({
  projectId,
  environmentCreated,
}: {
  projectId: string;
  environmentCreated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await environmentService.createEnvironment({
      name: values.name,
      projectId,
    });
    setIsLoading(false);

    if (!response.ok) {
      form.setError('root', {
        message: response.data.message || 'Something went wrong',
      });
      return;
    }
    form.reset();
    environmentCreated();
    closeModal();
  }

  return (
    <AlertDialog open={isModalOpen}>
      <Button onClick={openModal}> Add Environment </Button>
      <AlertDialogContent>
        <AlertDialogTitle>Create Environmnent</AlertDialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Environment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Environment Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}

            <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>

            <Button
              className="ml-2"
              variant={'default'}
              type="submit"
              loading={isLoading}
            >
              Add Environment
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
