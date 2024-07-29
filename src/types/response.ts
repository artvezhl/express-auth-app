export enum EResponseStatus {
  OK = "OK",
  ERROR = "ERROR",
}

export interface IResponse<T> {
  status: EResponseStatus;
  message: string;
  data?: T;
}
