export type TUser = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  isDeleted: boolean;
  varificationCode: number;
  expireIn:number
};
