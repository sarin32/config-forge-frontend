import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

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
import {useState} from 'react';
import {registrationService} from '@/api/registration.service';
import {setSessionToken} from '@/api/data.service';
import {useNavigate} from 'react-router-dom';

const formSchema = z.object({
  name: z.string().min(2, {message: 'Name must be at least 2 characters.'}),

  emailId: z.string().email(),

  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters.'})
    .max(16, {message: 'Password can not be more than 16 characters.'}),

  confirmPassword: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters.'})
    .max(16, {message: 'Password can not be more than 16 characters.'}),
});

export function Register({
  registrationSuccess,
}: {
  registrationSuccess: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordToggle = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailId: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  });

  async function onSubmit({
    emailId,
    name,
    password,
    confirmPassword,
  }: z.infer<typeof formSchema>) {
    if (confirmPassword !== password) {
      form.setError('confirmPassword', {message: 'Passwords do not match'});
      form.setError('password', {message: 'Passwords do not match'});
      return;
    }

    setIsLoading(true);
    const response = await registrationService.register({
      name,
      email: emailId,
      password,
    });
    setIsLoading(false);

    if (!response.ok) {
      form.setError('root', {
        message: response.data?.message || 'Something went wrong',
      });
      return;
    }
    setSessionToken(response.data.token);

    registrationService.sendVerificationEmail();

    registrationSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="emailId"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email id</FormLabel>
              <FormControl>
                <Input placeholder="Your Email id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  {...field}
                />
              </FormControl>
              <Button variant={'ghost'} onClick={passwordToggle}>
                {showPassword ? 'Hide Password' : 'Show Password'}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({field}) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Your password"
                  {...field}
                />
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
        <Button variant={'default'} type="submit" loading={isLoading}>
          SignUp
        </Button>
        <Button
          variant={'link'}
          onClick={() => {
            navigate('/login');
          }}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
