export interface ShortAdvertDtoInterface {
  cost: number;
  description: string;
  id: string;
  name: string;
  location?: string;
  createdAt: string;
  isActive: boolean;
  phone: number;
  imagesIds: string[];
  category: {
    id: string;
    parentId: string;
  };
  email: string;
}
