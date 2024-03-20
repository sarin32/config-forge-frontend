import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {OtpVerification} from './otp-verification';
import {Register} from './register';

export function Signup() {
  const [isOtpPage, setIsOtpPage] = useState(false);
  const navigate = useNavigate();

  const verificationSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-screen-sm">
      {isOtpPage ? (
        <OtpVerification otpVerificationSuccess={verificationSuccess} />
      ) : (
        <Register registrationSuccess={() => setIsOtpPage(true)} />
      )}
    </div>
  );
}
