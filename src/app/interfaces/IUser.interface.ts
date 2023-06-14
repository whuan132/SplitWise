export interface IUser{
  fullname: string,
  email: string,
  password: string
}

export interface decodedToken{
  _id: string,
  fullname: string,
  email: string
}
