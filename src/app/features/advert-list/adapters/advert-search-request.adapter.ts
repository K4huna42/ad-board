import {AdvertSearchRequest} from '../domains';
import {AdvertSearchRequestDto} from '../../../infrastructure/adverts/dto';

export const AdvertSearchRequestToDtoAdapter =
(request: AdvertSearchRequest): AdvertSearchRequestDto => {
  return {
    search: request.search,
    category: request.category,
    showNonActive: request.showNonActive,
  }
}