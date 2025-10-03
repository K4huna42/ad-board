import { inject, Injectable } from '@angular/core';
import { ImagesApiService } from '../../../../../infrastructure/images/images.api.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imagesApiService = inject(ImagesApiService);

  async reciveImg(img_ids: string[] = []): Promise<string[]> {
    const urls: string[] = [];
    for (const guid of img_ids) {
      const blob = await lastValueFrom(this.imagesApiService.getImage(guid));
      urls.push(URL.createObjectURL(blob));
    }
    return urls;
  }
}
