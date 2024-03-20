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
import {registrationService} from '@/api/registration.service';
import {useEffect, useState} from 'react';
import {setSessionToken} from '@/api/data.service';

const formSchema = z.object({
  otp: z
    .string()
    .min(6, {message: 'Password must be 6 digits'})
    .max(6, {message: 'Password must be 6 digits'}),
});

export function OtpVerification({
  otpVerificationSuccess,
}: {
  otpVerificationSuccess: Function;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [lastResendTime, setLastResendTime] = useState(Date.now());
  const [availableTries, setAvailableTries] = useState(3);
  const minimumResendInterval = 30000;

  useEffect(() => {
    // Calculate the difference between the current time and the last resend time
    const currentTime = Date.now();
    const timeSinceLastResend = currentTime - lastResendTime;

    if (availableTries && timeSinceLastResend < minimumResendInterval) {
      // If it hasn't been 30 seconds since the last resend, calculate the remaining time
      const remainingTime = minimumResendInterval - timeSinceLastResend;

      // Set a timeout to update the resend button visibility after the remaining time
      const timeoutId = setTimeout(() => {
        setShowResendButton(true);
      }, remainingTime);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      // If it's been more than 30 seconds since the last resend, show the resend button
      setShowResendButton(true);
    }
  }, [lastResendTime]); // Run this effect whenever lastResendTime changes

  const handleResendClick = () => {
    registrationService.sendVerificationEmail({});
    setAvailableTries(availableTries - 1);
    // Update the lastResendTime to the current time
    setLastResendTime(Date.now());

    // Hide the resend button
    setShowResendButton(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  async function onSubmit({otp}: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await registrationService.validateEmailOTP({
      otp,
    });

    setIsLoading(false);

    if (!response.ok) {
      form.setError('root', {
        message: response.data?.message || 'Something went wrong',
      });
      return;
    }

    setSessionToken(response.data.token);

    otpVerificationSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="otp"
          render={({field}) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="string" placeholder="Your OTP" {...field} />
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
          Submit
        </Button>

        <Button
          disabled={!showResendButton}
          variant={'ghost'}
          onClick={handleResendClick}
        >
          Resend OTP
        </Button>
      </form>
    </Form>
  );
}
