import { User } from "../models/user.model.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.send({
        message: "Credentials already exists",
        code: 403,
        ok: false,
      });
      throw new Error(400, "credentials already exists");
    }
    const user = await User.create({
      name,
      email,
      password,
    });

    res.send({
      message: "user creation successful",
      userData: {
        name,
        email,
      },
      code: 200,
      ok: true,
    });
  } catch (error) {
    console.log(error);
  }
  res.end();
  next();
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      res.send({
        message: "User not found",
        code: 404,
        ok: false,
      });
      throw new Error(404, " Email is not registered");
    } else {
      if (password === user.password) {
        res.send({
          message: "Congratulations you are in",
          userData: { name: user.name, email: user.email },
          code: 200,
          ok: true,
        });
      } else {
        res.send({
          message: "Invalid credentials",
          code: 400,
          ok: false,
        });
        throw new Error(400, "invalid credentials");
      }
    }
  } catch (error) {
    console.log(error);
  }

  res.end();
  next();
};
