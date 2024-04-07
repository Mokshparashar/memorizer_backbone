import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const refreshToken = await user.generateRefreshToken();
  const AccessToken = await user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, AccessToken };
};
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      res.send({
        message: "Email already taken",
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
};

export const loginUser = async (req, res) => {
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
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      throw new Error(400, "password is not correct");
    }
    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select("-password ");
    // const cookieOptions = {
    //   httpsOnly: true,
    //   secure: true,
    // };

    return res

      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json({ user: loggedInUser, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
  }
};
