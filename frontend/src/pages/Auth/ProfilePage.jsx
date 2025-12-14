import ProfileForm from '../../components/Auth/ProfileForm';
import PasswordChangeForm from '../../components/Auth/PasswordChangeForm';

const ProfilePage = () => (
  <div className="max-w-2xl mx-auto space-y-8">
    <div className="sweet-card p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
      <ProfileForm />
    </div>
    <div className="sweet-card p-6">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <PasswordChangeForm />
    </div>
  </div>
);

export default ProfilePage;