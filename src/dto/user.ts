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
