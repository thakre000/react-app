import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (id) {
      API.get(`/tasks/${id}`).then(res =>
        setFormData({ ...res.data, dueDate: res.data.dueDate.split('T')[0] })
      );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/tasks/${id}`, formData);
        toast.success('Task updated successfully!');
      } else {
        await API.post('/tasks', formData);
        toast.success('Task created successfully!');
      }
      navigate('/tasks');
    } catch (err) {
      toast.error('Operation failed!');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">{id ? 'Edit Task' : 'New Task'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          className="border p-2"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          className="border p-2"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        ></textarea>
        <input
          type="date"
          className="border p-2"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
        />
        <select
          className="border p-2"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="bg-green-500 text-white py-2 rounded">Save</button>
      </form>
    </div>
  );
}
