import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './services/images.service';

@Component({
  selector: 'app-images',
  imports: [CommonModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss',
})
export class ImageComponent implements OnChanges {
  @Input() img_ids: string[] = [];
  @Input() showAll = false;
  imageUrls: string[] = [];
  selectedImage: string | null = null;

  private imagesService = inject(ImageService);

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (!changes['img_ids']) return; // если в изменениях (changes) нет поля img_ids, значит массив картинок не изменился

    if (this.img_ids.length === 0) { // Если массив img_ids пустой:
      this.imageUrls = []; //очищаем список картинок (imageUrls),
      this.selectedImage = null; //сбрасываем выбранное изображение (selectedImage),
      return; // сразу выходим.
    }

    const currentIds = [...this.img_ids]; // разворачиваем массив и создаем копию 
    const urls = await this.imagesService.reciveImg(currentIds); // отправляем id картинок и получаем ссылки на них

    if (this.img_ids.join(',') === currentIds.join(',')) { 
    /*Сравнение: не изменился ли массив img_ids за то время, пока мы ждали загрузку(Сравниваются оба массива как строки ("id1,id2,id3"))*/

      this.imageUrls = urls;
      this.selectedImage = urls[0] ?? null;
    }
  }

  selectImage(url: string) {
    this.selectedImage = url; // используется для отображения выбранной картинки у конкретного объявления из миниатюр
  }
}
