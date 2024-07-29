import { User } from "../models";

export const isUserExist = async (email: string): Promise<boolean> => {
  const existingUser = await User.findOne({ email });

  return !!existingUser;
};
