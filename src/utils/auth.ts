const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import { DataStoredInToken, IUser } from "../types";
import { Types } from "mongoose";
import { TOKEN_EXPIRATION } from "../constants";

export const createJWTToken = async (
  user: IUser & {
    _id: Types.ObjectId;
  },
  provided_password: string
): Promise<null | string> => {
  const isPasswordMatching = await bcrypt.compare(
    provided_password,
    user.password
  );

  if (isPasswordMatching) {
    const expiresIn = TOKEN_EXPIRATION;
    const secret: string = process.env.JWT_SECRET as string;
    const dataStoredInToken: DataStoredInToken = {
      _id: String(user._id),
    };
    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  }

  return null;
};
