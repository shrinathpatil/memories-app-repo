import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, resp) => {
  try {
    const body = req.body;
    const user = await User.findOne({ uid: body.uid });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...other } = user._doc;
      resp
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(other);
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(body.uid, salt);
      const newUser = new User({
        username: body.displayName,
        email: body.email,
        password: hashPass,
        img: body.photoURL,
        uid: body.uid,
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      const { password, ...other } = savedUser;
      resp
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(other);
    }
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const createUser = async (req, resp) => {
  try {
    const { username, password: pass, email } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(pass, salt);
    const newUser = new User({
      username,
      email,
      password: hashPass,
    });

    const savedUser = await newUser.save();
    const { password, ...other } = savedUser._doc;
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    resp
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(other);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const loginUser = async (req, resp) => {
  try {
    let { email, password: pass } = req.body;
    const user = await User.findOne({
      email,
    });

    const isCorrect = await bcrypt.compare(pass, user.password);

    if (isCorrect) {
      const { password, ...other } = user._doc;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      console.log(token);
      return resp
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(other);
    } else {
      return resp.status(404).json({ message: "wrong credentials" });
    }
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const getUser = async (req, resp) => {
  try {
    const { id: _id } = req.params;
    if (mongoose.Types.ObjectId(_id)) {
      const user = await User.findOne({ _id });
      const { password, ...other } = user._doc;
      return resp.status(200).json(other);
    } else {
      return resp.status(404).json({ message: "user not existed!" });
    }
  } catch (e) {
    resp.status(500).json(e);
  }
};
