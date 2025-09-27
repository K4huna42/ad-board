import { inject, Injectable } from '@angular/core';
import { ImagesApiService } from '../../../../../infrastructure/images/images.api.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imagesApiService = inject(ImagesApiService);

  async reciveImg(img_ids: string[] = [], imageUrls: string[] = []) {
    for (const guid of img_ids) {
      const value = await lastValueFrom(this.imagesApiService.getImage(guid));
      const objectURL = URL.createObjectURL(value);
      imageUrls.push(objectURL);
    }
  }
}
