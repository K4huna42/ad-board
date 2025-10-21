import { inject, Injectable } from '@angular/core';
import { UserDataApiService } from '../../../../services/user-data-api.service';
import { ToastService } from '../../../dump/toast/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private userDataApiService = inject(UserDataApiService);
  private toast = inject(ToastService)
  userData = this.userDataApiService.userData;

  putData(formData: FormData) {
    const token = localStorage.getItem('VXNlcklk');
    const id = this.userData()?.id;

    if (id != null && token != null) {
      this.userDataApiService.putUserData(formData, id, token).subscribe(
        () => {},
        (error) => {
          this.toast.show('ошибка', 'error')
          console.log(error.error.message);
        },
      );
    }
  }
}
