const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    filter.$or = [{ createdBy: req.user.id }, { assignedTo: req.user.id }];

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email');

    res.json({ tasks, total, page, limit });
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.createdBy.toString() !== req.user.id && String(task.assignedTo?._id) !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = await Task.create({ title, description, dueDate, priority, assignedTo, createdBy: req.user.id });
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    task = await Task.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized: No user found' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    if (task.createdBy && task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.id); 
    res.json({ msg: 'Task removed successfully' });
  } catch (e) {
    console.error("Delete Task Error:", e.message);
    res.status(500).json({ msg: 'Server error', error: e.message });
  }
};


exports.patchTask = async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ msg: 'Not authorized' });
    Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
};
