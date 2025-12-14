import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const PasswordChangeForm = () => {
  const { changePassword } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    await changePassword(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('old_password')} type="password" className="sweet-input" placeholder="Current Password" />
      <input {...register('new_password')} type="password" className="sweet-input" placeholder="New Password" />
      <input {...register('new_password_confirm')} type="password" className="sweet-input" placeholder="Confirm New Password" />
      <button type="submit" className="sweet-btn-primary w-full">Change Password</button>
    </form>
  );
};

export default PasswordChangeForm;