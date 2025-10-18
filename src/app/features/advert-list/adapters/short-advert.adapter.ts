import { ShortAdvert } from '../domains';
import { ShortAdvertDtoInterface } from '../../../infrastructure/adverts/dto';

export const ShortAdvertFromDTOAdapter = (data: ShortAdvertDtoInterface): ShortAdvert => {
  return {
    createdAt: data.createdAt,
    description: data.description,
    id: data.id,
    imagesIds: data.imagesIds,
    isActive: data.isActive,
    location: data.location,
    name: data.name,
    cost: data.cost,
    phone: data.phone,
  };
};
