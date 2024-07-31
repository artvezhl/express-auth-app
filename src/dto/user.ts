import { Expose } from "class-transformer";
import { EGender } from "../types";
import { ObjectId } from "mongodb";

export class UserResponseDTO {
  @Expose()
  id!: ObjectId;

  @Expose()
  createdAt!: string;

  @Expose()
  updatedAt!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  birthDate!: Date;

  @Expose()
  gender!: EGender;

  @Expose()
  avatar?: string;
}

export class UserCreateDTO {
  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  password!: string;

  @Expose()
  birthDate!: Date;

  @Expose()
  gender!: EGender;
}

export class UserLoginDTO {
  @Expose()
  email!: string;

  @Expose()
  password!: string;
}

export class UserUpdateDTO {
  @Expose()
  name!: string;
}

export class UserAvatarUpdateDTO {
  @Expose()
  avatar!: string;
}

export class UserPasswordUpdateDTO {
  @Expose()
  new_password!: string;

  @Expose()
  prev_password!: string;
}
