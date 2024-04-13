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
import {useFieldArray, useForm} from 'react-hook-form';
import {z} from 'zod';
import {variableService} from '@/api/variable.service';

const formSchema = z.object({
  values: z.array(z.object({value: z.string()})),
});

export function ManageVariableForm({
  keyValue,
  variableData,
  close,
  back,
}: {
  keyValue: string;
  variableData: {
    variableId: string | null;
    value: string;
    environmentId: string;
    environmentName: string;
  }[];
  close: () => void;
  back?: () => void;
}) {
  console.log(variableData);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      values: variableData.map(value => {
        return {value: value.value};
      }),
    },
  });

  const valuefields = useFieldArray<z.infer<typeof formSchema>>({
    control: form.control,
    name: 'values',
  });

  const createVariable = async (
    environmentId: string,
    value: string,
    index: number
  ) => {
    const filedName: `values.${number}.value` = `values.${index}.value`;
    if (!value) {
      form.setError(filedName, {message: 'Please provide value'});
      return;
    }
    form.clearErrors(filedName);
    const response = await variableService.createVariable({
      environmentId,
      key: keyValue,
      value,
      isOverride: false,
    });
    if (!response.ok) {
      form.setError(filedName, {message: response.data.message});
      return;
    }
    variableData[index].variableId = response.data.variableId;
    variableData[index].value = value;
  };

  return (
    <Form {...form}>
      <form className="space-y-2">
        <FormItem>
          <FormLabel>Key</FormLabel>
          <FormControl>
            <Input placeholder="Key" value={keyValue} disabled={true} />
          </FormControl>
          <FormMessage />
        </FormItem>

        {valuefields.fields.map((_, index) => (
          <FormItem key={index}>
            <FormField
              control={form.control}
              key={index}
              name={`values.${index}.value`}
              render={({field}) => (
                <FormItem>
                  <FormLabel>{variableData[index].environmentName}</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Input {...field} />
                      <Button
                        type="button"
                        className="ml-2"
                        onClick={() =>
                          createVariable(
                            variableData[index].environmentId,
                            field.value,
                            index
                          )
                        }
                      >
                        {variableData[index].variableId ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>
        ))}

        {form.formState.errors.root && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <div className="flex justify-end">
          {back && (
            <Button variant={'link'} type="button" onClick={back}>
              Back
            </Button>
          )}
          <Button variant={'outline'} type="button" onClick={close}>
            Close
          </Button>
        </div>
      </form>
    </Form>
  );
}
