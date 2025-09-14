import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ImagesApiService } from '../../../../infrastructure/images/images.api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements OnChanges {

  @Input() img_ids:string[] = []; 
  imgArray:Blob[] = [];

  constructor(private imagesApiService: ImagesApiService){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["img_ids"]){
      this.reciveImg()
    }
  }

  reciveImg(){
    this.img_ids.forEach(guid => {
      this.imagesApiService.getImage(guid).subscribe(
        (value) => {
          console.log(value)
          this.imgArray.push(value)
        },
        (error) => {
          console.log(error.error.message)
        }
      )
    })
  }







  

}
