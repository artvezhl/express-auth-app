export interface IUser {
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: EGender;
  avatar?: string;
}

export enum EGender {
  MALE = "male",
  FEMALE = "female",
}
