export interface ShortAdvert {
  cost: number;
  description: string;
  id: string;
  name: string;
  phone: number;
  location?: string;
  createdAt: string;
  isActive: boolean;
  imagesIds: string[];
  category:{
    id:string
    parentId:string
  } 
}
