import { User } from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne(email);
    if (existedUser) {
      throw new Error("credentials already exists");
    }
    await User.create({
      name,
      email,
      password,
    });
  } catch (error) {
    console.log(error);
  }
};
