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

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRETKEY
    );

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

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRETKEY
      );
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      /* we're creating a random password for the user initially 'cause a user can't be created without a password. This random password can later be changed by our user */
      /* we're generating a random number between 0 and 1 with ".random()", which we'll then convert to letters and numbers from numbers 0-9 and letters A-Z together by using ".toString(36)". Finally, we extract only the last 8 digits of the generated number ".slice(-8)". For instance, the number until ".toString(36)" could be 0.54726ec06w7 and then with ".slice(-8)", we extract only 54726ec0 & remove the "0." */
      /* the process is repeated to make it more secure */
      const generatedRandomPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedRandomPassword, 10);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          /* if its toString(9) it will generate only numbers */
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    console.log(error);
  }
};
