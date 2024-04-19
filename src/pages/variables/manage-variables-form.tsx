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

type formVariableValueName = `values.${number}.value`;

const formSchema = z.object({
  values: z.array(z.object({value: z.string()})),
});

export function ManageVariableForm({
  keyValue,
  variableData,
  close,
  back,
  variableUpdates,
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
  variableUpdates: (params: {
    variableId: string;
    value: string;
    environmentId: string;
  }) => void;
}) {
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

  const isValidVariableValue = (
    variableValue: string,
    filedName: formVariableValueName
  ): boolean => {
    if (!variableValue) {
      form.setError(filedName, {message: 'Please provide value'});
      return false;
    }
    form.clearErrors(filedName);
    return true;
  };

  const createVariable = async (
    environmentId: string,
    value: string,
    index: number
  ) => {
    const filedName: formVariableValueName = `values.${index}.value`;
    if (!isValidVariableValue(value, filedName)) return;

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
    variableUpdates({
      environmentId,
      variableId: response.data.variableId,
      value: value,
    });
  };

  const updateVariable = async (
    environmentId: string,
    value: string,
    index: number
  ) => {
    const filedName: formVariableValueName = `values.${index}.value`;
    if (!isValidVariableValue(value, filedName)) return;

    const variableId = variableData[index].variableId;
    if (!variableId) return;

    const response = await variableService.updateVariable({
      variableId,
      key: keyValue,
      value,
    });

    if (!response.ok) {
      form.setError(filedName, {message: response.data.message});
      return;
    }
    variableUpdates({
      environmentId,
      variableId: variableId,
      value: value,
    });
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

                      {/* create or update button */}
                      <div className="ml-2">
                        {variableData[index].variableId ? (
                          <Button
                            type="button"
                            onClick={() =>
                              updateVariable(
                                variableData[index].environmentId,
                                field.value,
                                index
                              )
                            }
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={() =>
                              createVariable(
                                variableData[index].environmentId,
                                field.value,
                                index
                              )
                            }
                          >
                            Create
                          </Button>
                        )}
                      </div>
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
