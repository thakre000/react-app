import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import useAuth from './hooks/useAuth';


export default function App() {
const { user } = useAuth();
return (
<div className="min-h-screen bg-gray-100 p-4">
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/tasks" element={ <TaskList /> } />
<Route path="/tasks/new" element={<TaskForm />} />
<Route path="/tasks/:id" element={<TaskDetails />} />
<Route path="/tasks/edit/:id" element={<TaskForm />} />
<Route path="*" element={<Navigate to="/tasks" />} />
</Routes>
</div>
);
}