import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from './services/images.service';

@Component({
  selector: 'app-images',
  imports: [CommonModule],
  templateUrl: './images.component.html',
  styleUrl: './images.component.scss'
})
export class ImageComponent implements OnChanges {

  @Input() img_ids: string[] = [];
  imageUrls: string[] = [];

  constructor(private imagesService:ImageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["img_ids"]) {
      this.imagesService.reciveImg(this.img_ids, this.imageUrls)
    }
  }

  









}
