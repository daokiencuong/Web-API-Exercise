import { api } from '../config/axios.config';

export function getUsers() {
  return api.get('/users');
}

export function updateUser(id, userData) {
  return api.put(`/users/${id}`, userData);
}

export function deleteUser(id) {
  return api.delete(`/users/${id}`);
}

export function createUser(userData) {
  return api.post('/users', userData);
}
