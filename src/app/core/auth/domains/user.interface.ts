export interface User {
  name?: string;
  login?: string;
  password?: string;
}

export interface UserData {
  id: string;
  name: string;
  role: string;
  adverts: [];
  registeredTime: string;
}
