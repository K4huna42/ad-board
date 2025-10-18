import { ShortAdvert } from "../../../features/advert-list/domains";

export interface User {
  name?: string;
  login?: string;
  password?: string;
  id?: string
  adverts?: ShortAdvert[];
}

export interface UserData {
  id?: string;
  name?: string;
  role?: string;
  adverts?: ShortAdvert[];
  registeredTime?: string;
}
