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
      // Ждёт выполнения всех промисов параллельно и возвращает массив результатов.

      img_ids.map(id => lastValueFrom(this.imagesApiService.getImage(id)))
      // Преобразуем каждый id в картинку, а LastValueFrom преобразует Observable в обычный Promise 

    );
    return blobs.map(blob => URL.createObjectURL(blob));
    // создаем временные ссылки на файлы, который потом монжно использовать в src, и возвращаем их массив
  }
}
