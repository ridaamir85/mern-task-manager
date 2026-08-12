const Task = require('../models/Task');

async function createTask(req, res, next) {
  try {
    const { title, description, completed } = req.body;
    if (!title) {
      res.status(400);
      throw new Error('Title is required.');
    }

    const task = await Task.create({
      title,
      description,
      completed,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const filter = { owner: req.user._id };
    if (req.query.completed === 'true') filter.completed = true;
    if (req.query.completed === 'false') filter.completed = false;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found.');
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const allowedFields = ['title', 'description', 'completed'];
    const updates = Object.keys(req.body);
    if (!updates.length || updates.some((field) => !allowedFields.includes(field))) {
      res.status(400);
      throw new Error('You may update only title, description, or completed.');
    }

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found.');
    }

    updates.forEach((field) => {
      task[field] = req.body[field];
    });
    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      res.status(404);
      throw new Error('Task not found.');
    }
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
