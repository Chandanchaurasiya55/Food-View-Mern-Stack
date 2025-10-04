const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

async function registerUser(req, res) {
  const { fullName, email, password } = req.body;
  const exists = await userModel.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await userModel.create({ fullName, email, password: hashed });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token, makeCookieOptions());
  res.status(201).json({ message: 'User registered successfully', user: { _id: user._id, email: user.email, fullName: user.fullName } });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token, makeCookieOptions());
  res.status(200).json({ message: 'User logged in successfully', user: { _id: user._id, email: user.email, fullName: user.fullName } });
}

function logoutUser(req, res) {
  res.clearCookie('token', makeCookieOptions());
  res.status(200).json({ message: 'User logged out successfully' });
}

async function registerFoodPartner(req, res) {
  const { name, email, password, phone, address, contactName } = req.body;
  const exists = await foodPartnerModel.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Food partner account already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const fp = await foodPartnerModel.create({ name, email, password: hashed, phone, address, contactName });
  const token = jwt.sign({ id: fp._id }, process.env.JWT_SECRET);
  res.cookie('token', token, makeCookieOptions());
  res.status(201).json({ message: 'Food partner registered successfully', foodPartner: { _id: fp._id, email: fp.email, name: fp.name } });
}

async function loginFoodPartner(req, res) {
  const { email, password } = req.body;
  const fp = await foodPartnerModel.findOne({ email });
  if (!fp) return res.status(400).json({ message: 'Invalid email or password' });
  const ok = await bcrypt.compare(password, fp.password);
  if (!ok) return res.status(400).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: fp._id }, process.env.JWT_SECRET);
  res.cookie('token', token, makeCookieOptions());
  res.status(200).json({ message: 'Food partner logged in successfully', foodPartner: { _id: fp._id, email: fp.email, name: fp.name } });
}

function logoutFoodPartner(req, res) {
  res.clearCookie('token', makeCookieOptions());
  res.status(200).json({ message: 'Food partner logged out successfully' });
}

async function me(req, res) {
  const token = req.cookies && req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
  me,
};
