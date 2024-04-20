import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const refreshToken = await user.generateRefreshToken();
  const accessToken = await user.generateAccessToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
};
export const registerUser = asyncHandler(async (req, res) => {
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
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    var accessToken;
    var refreshToken;
    console.log(email);
    let user = await User.findOne({ email });
    console.log(user);
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
      res.json({ message: "Invalid credentials" });
      throw new Error(400, "password is not correct");
    }
    await generateAccessAndRefreshToken(user._id).then((res) => {
      accessToken = res.accessToken;
      refreshToken = res.refreshToken;
    });

    console.log(accessToken);
    console.log(refreshToken);
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const cookieOptions = {
      httpsOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({ user: loggedInUser });
  } catch (error) {
    console.log(error);
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const cookieOptions = {
      httpsOnly: true,
      secure: true,
    };

    res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "user loggedout successfully" });
  } catch (error) {
    console.log(error);
  }
});
