import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';


export default function TaskDetails() {
const { id } = useParams();
const [task, setTask] = useState(null);


useEffect(() => { API.get(`/tasks/${id}`).then(res => setTask(res.data)); }, [id]);
if (!task) return <p>Loading...</p>;


return (
<div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
<h2 className="text-xl font-bold mb-2">{task.title}</h2>
<p className="mb-2">{task.description}</p>
<p className="mb-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
<p>Status: {task.status}</p>
</div>
);
}