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
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

const addKeyFormSchema = z.object({
  key: z
    .string()
    .min(2, {message: 'key must be at least 2 characters.'})
    .max(40, {message: 'key can not be more than 40 characters.'}),
});

export function AddKeyForm({
  cancel,
  proceed,
  defaultKey,
}: {
  defaultKey: string;
  cancel: () => void;
  proceed: (key: string) => void;
}) {
  const form = useForm<z.infer<typeof addKeyFormSchema>>({
    resolver: zodResolver(addKeyFormSchema),
    defaultValues: {key: defaultKey},
  });

  function handleSubmit(values: z.infer<typeof addKeyFormSchema>): void {
    proceed(values.key);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="key"
          render={({field}) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex mt-3 space-x-2 justify-end">
          <Button onClick={cancel} variant={'outline'}>
            Cancel
          </Button>
          <Button>Proceed</Button>
        </div>
      </form>
    </Form>
  );
}
