import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import User from "../models/user.schema.js";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true, //user can see the token but can not change the token we can see but we can't edit, must do from the server side
};

export const signUp = asyncHandler(async (req, res) => {
  // get data from user
  const { name, email, password } = req.body;
  // validation
  if (!name || !email || !password) {
    // throw new Error("Request fill");
    throw new CustomError("Request fill", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }
  const user = await User.create({ name, email, password });
  const token = user.getJwtToken();

  //   store this token to the users cookie by default nodejs cant access it because cookie is browsers object, to access we need to  use cookie-parser
  res.cookie("token", token, cookieOptions);
  //  safety because for the creation operation select:false is not work in the schema it only works after that so flash out the password
  user.password = undefined;
  //   send back a response to the user
  res.status(200).json({ success: true, token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    throw new CustomError("Please fill all details", 400);
  }

  const user = User.findOne({ email }).select("+password");
  if (!user) {
    throw new CustomError("Invalid credential", 400);
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (isPasswordMatch) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({ success: true, token, user });
  }

  throw new CustomError("Password is incorrect", 400);
});

export const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "logged out" });
};
