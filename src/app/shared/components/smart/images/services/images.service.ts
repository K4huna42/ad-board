import { Injectable } from '@angular/core';
import { ImagesApiService } from '../../../../../infrastructure/images/images.api.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private imagesApiService: ImagesApiService) { }

  reciveImg(img_ids: string[] = [],imageUrls: string[] = []) {
    // img_ids.forEach(guid => {
    //   this.imagesApiService.getImage(guid).subscribe(
    //     (value) => {
    //       const objectURL = URL.createObjectURL(value);
    //       imageUrls.push(objectURL);
    //       console.log(guid)
    //     },
    //     (error) => {
    //       console.log(error.error.message)
    //     }
    //   )
    // })
    for(let guid of img_ids){
      this.imagesApiService.getImage(guid).subscribe(
        (value) => {
          const objectURL = URL.createObjectURL(value);
          imageUrls.push(objectURL);
          console.log(guid)
        },
        (error) => {
          console.log(error.error.message)
        }
      )
    }
  }
}
