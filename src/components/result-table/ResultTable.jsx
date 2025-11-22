import React, { useEffect, useState } from 'react';
import './ResultTable.css';
import { getUsers } from '../../services/api.service';
import { deleteUserById, updateUserInfo } from '../../services/user.service';

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const usersRes = await getUsers();
      setUsers(usersRes.data);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Thêm user mới từ props
  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  // Lọc theo keyword
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(keyword.toLowerCase()) ||
      u.username.toLowerCase().includes(keyword.toLowerCase()),
  );

  // Tính paginate
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    deleteUserById(id);
  };

  const editUser = (user) => {
    setEditing({ ...user, address: { ...user.address } });
  };

  const handleEditChange = (key, value) => {
    if (['street', 'suite', 'city'].includes(key)) {
      setEditing({
        ...editing,
        address: { ...editing.address, [key]: value },
      });
    } else {
      setEditing({ ...editing, [key]: value });
    }
  };

  const saveUser = () => {
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
    updateUserInfo(editing.id, editing);
    setEditing(null);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="result-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.website}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {editing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Sửa người dùng</h3>

            <label>Name:</label>
            <input
              value={editing.name}
              onChange={(e) => handleEditChange('name', e.target.value)}
            />

            <label>Username:</label>
            <input
              value={editing.username}
              onChange={(e) => handleEditChange('username', e.target.value)}
            />

            <label>Email:</label>
            <input
              value={editing.email}
              onChange={(e) => handleEditChange('email', e.target.value)}
            />

            <label>Phone:</label>
            <input
              value={editing.phone}
              onChange={(e) => handleEditChange('phone', e.target.value)}
            />

            <label>Website:</label>
            <input
              value={editing.website}
              onChange={(e) => handleEditChange('website', e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={saveUser}>Lưu</button>
              <button onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultTable;
