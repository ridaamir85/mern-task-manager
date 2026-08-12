const Task = require('../models/Task');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('An account with this email already exists.');
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error('Email and password are required.');
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Incorrect email or password.');
    }

    res.json({
      success: true,
      user: publicUser(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
}

function getProfile(req, res) {
  res.json({ success: true, user: publicUser(req.user) });
}

async function updateProfile(req, res, next) {
  try {
    const allowedFields = ['name', 'email', 'password'];
    const updates = Object.keys(req.body);
    if (!updates.length || updates.some((field) => !allowedFields.includes(field))) {
      res.status(400);
      throw new Error('You may update only name, email, or password.');
    }

    updates.forEach((field) => {
      req.user[field] = req.body[field];
    });
    await req.user.save();

    res.json({ success: true, user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

async function deleteProfile(req, res, next) {
  try {
    await Task.deleteMany({ owner: req.user._id });
    await req.user.deleteOne();
    res.json({ success: true, message: 'Account and associated tasks deleted.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getProfile, updateProfile, deleteProfile };
