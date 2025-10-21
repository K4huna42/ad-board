import { inject, Injectable } from '@angular/core';
import { AdvertsApiService } from '../../../infrastructure/adverts/services/adverts.api.service';
import { ToastService } from '../../../shared/components/dump/toast/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private advertApiService = inject(AdvertsApiService)
  private toast = inject(ToastService)

  getAllThisComments(id:string){
    this.advertApiService.getAllComments(id).subscribe(
      (value) => {
        console.log(value)
      },
      (error) => {
        console.log(error)
        this.toast.show('ошибка', 'error')
      }
    )
  }
}
