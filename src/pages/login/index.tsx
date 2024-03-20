'use client';

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
  email_id: z.string().min(2, {
    message: 'email id must be at least 2 characters.',
  }),

  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters.'})
    .max(16, {message: 'Password can not be more than 16 characters.'}),
});

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordToggle = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_id: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const response = await registrationService.login({
      email: values.email_id,
      password: values.password,
    });
    setIsLoading(false);

    if (!response.ok) {
      form.setError('root', {
        message: response.data.message || 'Something went wrong',
      });
      return;
    }
    setSessionToken(response.data.token);

    navigate('/dashboard');
  }

  return (
    <div className="max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email_id"
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
                    placeholder="Your pasword"
                    {...field}
                  />
                </FormControl>
                <Button
                  variant={'ghost'}
                  type="button"
                  onClick={passwordToggle}
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </Button>
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
            Login
          </Button>
          <Button
            variant={'link'}
            onClick={() => {
              navigate('/signup');
            }}
          >
            SignUp
          </Button>
        </form>
      </Form>
    </div>
  );
}
