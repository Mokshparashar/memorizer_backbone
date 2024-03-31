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
    await User.create({
      name,
      email,
      password,
    });

    res.send({
      message: "user creation successful",
      code: 200,
      ok: true,
    });
  } catch (error) {
    console.log(error);
  }
  res.end();
  next();
};
