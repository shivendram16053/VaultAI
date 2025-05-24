import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState('Verifying...');

  useEffect(() => {
    fetch(`https://expense-buddy-9aqs.onrender.com/api/verify/${token}`)
      .then(res => {
        if (res.ok) return res.text();
        throw new Error('Verification failed');
      })
      .then(text => setMessage(text))
      .catch(() => setMessage('Invalid or expired verification link.'));
  }, [token]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{message}</p>
        <p>If you have successfully verified your email, you can now <a href="/login">log in</a>.</p>
    </div>
  );
};

export default VerifyEmail;
