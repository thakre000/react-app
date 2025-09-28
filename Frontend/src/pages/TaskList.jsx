import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import Pagination from "../components/Pagination";
import { motion, AnimatePresence } from "framer-motion";


function ConfirmOverlay({ open, onClose, onConfirm, message }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center z-10"
      >
        <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-80 text-center">
          <p className="mb-4 text-lg">{message}</p>
          <div className="flex justify-around">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(null); // task._id of overlay

  const fetchTasks = async (pageNum = 1) => {
    try {
      const res = await API.get(`/tasks?page=${pageNum}&limit=5`);
      setTasks(res.data.tasks);
      setTotal(res.data.total);
      setPage(res.data.page);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setConfirmOpen(null);
      fetchTasks(page);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const sortTasksByPriority = (tasks) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return tasks.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "text-red-600";
    if (priority === "medium") return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-4xl relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Tasks Management System
          </h2>
          <Link
            to="/tasks/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Task
          </Link>
        </div>

        <div className="relative">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                sortTasksByPriority(tasks).map((task) => (
                  <tr key={task._id} className="border-b relative">
                    <td className={`p-3 font-bold ${getPriorityColor(task.priority)}`}>
                      {task.title}
                    </td>
                    <td className="p-3">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{task.status}</td>
                    <td className="p-3 text-center space-x-3 relative">
                      <Link
                        className="text-blue-600 hover:underline"
                        to={`/tasks/${task._id}`}
                      >
                        View
                      </Link>
                      <Link
                        className="text-green-600 hover:underline"
                        to={`/tasks/edit/${task._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() =>
                          setConfirmOpen(confirmOpen === task._id ? null : task._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan="4">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {confirmOpen && (
            <ConfirmOverlay
              open={true}
              message="Delete this task?"
              onClose={() => setConfirmOpen(null)}
              onConfirm={() => handleDelete(confirmOpen)}
            />
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination page={page} total={total} limit={5} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}
