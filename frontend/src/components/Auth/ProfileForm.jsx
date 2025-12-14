import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    }
  });

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('username')} className="sweet-input" placeholder="Username" />
      <input {...register('email')} type="email" className="sweet-input" placeholder="Email" />
      <input {...register('first_name')} className="sweet-input" placeholder="First Name" />
      <input {...register('last_name')} className="sweet-input" placeholder="Last Name" />
      <button type="submit" className="sweet-btn-primary w-full">Update Profile</button>
    </form>
  );
};

export default ProfileForm;