import { inject, Injectable } from '@angular/core';
import { ImagesApiService } from '../../../../../infrastructure/images/images.api.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imagesApiService = inject(ImagesApiService);

  async reciveImg(img_ids: string[] = []): Promise<string[]> {
    const blobs = await Promise.all(
      img_ids.map((id) => lastValueFrom(this.imagesApiService.getImage(id))),
    );
    return blobs.map((blob) => URL.createObjectURL(blob));
  }
}
