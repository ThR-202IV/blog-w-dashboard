import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  /* for custom error handling, where the system itself doesn't throw an error but we need to in the moment */
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required!"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "Registration successful!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  /* for custom error handling, where the system itself doesn't throw an error but we need to in the moment */
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(404, "Wrong credentials!"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRETKEY);

    /* 'cause we have extreacted the password from req.body, we can't use the same variable name as we would have name , so we use the variable name pass */
    /* we are seperating the user password from the rest of other data 'cause we don't want to send the password in the response even if it has been hashed */
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        /* for cookie, we must add httpOnly in order to make our cookie secure */
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
