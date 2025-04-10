import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User exists" });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);
  res.json({ user, token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user._id);
  res.json({ user, token });
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out" });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { name, avatar, description } = req.body;

  user.name = name || user.name;
  user.avatar = avatar || user.avatar;
  user.description = description || user.description;

  await user.save();
  res.json(user);
};
