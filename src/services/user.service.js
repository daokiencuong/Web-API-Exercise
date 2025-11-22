import { toast } from 'react-toastify';
import { createUser, deleteUser, updateUser } from './api.service';

export async function updateUserInfo(id, userData) {
  const response = await updateUser(id, userData);
  if (response.status === 200) {
    toast.success('Cập nhật người dùng thành công!');
  } else {
    toast.error('Cập nhật người dùng thất bại!');
  }
}

export async function deleteUserById(id) {
  const response = await deleteUser(id);
  if (response.status === 200) {
    toast.success('Xóa người dùng thành công!');
  } else {
    toast.error('Xóa người dùng thất bại!');
  }
}

export async function createNewUser(userData) {
  const response = await createUser(userData);
  if (response.status === 201) {
    toast.success('Thêm người dùng thành công!');
  } else {
    toast.error('Thêm người dùng thất bại!');
  }
}
