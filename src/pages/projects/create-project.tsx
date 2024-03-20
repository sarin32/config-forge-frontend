import {projectService} from '@/api/project.service';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {zodResolver} from '@hookform/resolvers/zod';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {message: 'Project Name must be at least 8 characters.'})
    .max(16, {message: 'Project Name can not be more than 16 characters.'}),
});

export function CreateProject() {
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
    const response = await projectService.createProject({name: values.name});
    setIsLoading(false);

    if (!response.ok) {
      form.setError('root', {
        message: response.data.message || 'Something went wrong',
      });
      return;
    }
    closeModal();
  }

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger onClick={openModal}>
        Create a New Project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Create New Project</AlertDialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Name" {...field} />
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
              Create Project
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
