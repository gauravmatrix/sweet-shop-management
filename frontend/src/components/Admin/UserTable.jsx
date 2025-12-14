const UserTable = ({ users }) => (
  <table className="w-full">
    <thead>
      <tr>
        <th>Email</th>
        <th>Username</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users?.map(user => (
        <tr key={user.id}>
          <td>{user.email}</td>
          <td>{user.username}</td>
          <td>{user.is_admin ? 'Admin' : 'User'}</td>
          <td>
            <button className="text-sweet-primary">Edit</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UserTable;