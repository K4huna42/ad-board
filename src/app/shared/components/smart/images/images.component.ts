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
    if (!changes['img_ids']) return;

    if (this.img_ids.length === 0) {
      this.imageUrls = [];
      this.selectedImage = null;
      return;
    }

    const currentIds = [...this.img_ids];
    const urls = await this.imagesService.reciveImg(currentIds);

    if (this.img_ids.join(',') === currentIds.join(',')) {
      this.imageUrls = urls;
      this.selectedImage = urls[0] ?? null;
    }
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }
}
