import { inject, Injectable } from '@angular/core';
import { ToastService } from '../../../shared/components/dump/toast/services/toast.service';
import { CommentsApiService } from '../../../infrastructure/comments/comments.api.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { Comment } from '../domains/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private commentsApiService = inject(CommentsApiService);
  private toast = inject(ToastService);

  getAllThisComments(id: string): Observable<Comment[]> {
    return this.commentsApiService.getAllComments(id).pipe(
      catchError((error) => {
        console.error(error);
        this.toast.show('Ошибка при загрузке комментариев', 'error');
        return of([]);
      }),
    );
  }
  createComment(id: string, form: FormData): Observable<Comment | null> {
    const token = localStorage.getItem('VXNlcklk');

    if (!token) {
      this.toast.show('Вы не авторизованы', 'error');
      return of(null);
    }

    return this.commentsApiService.createComment(token, id, form).pipe(
      tap(() => {
        this.toast.show('Комментарий добавлен', 'success');
      }),
      catchError((error) => {
        console.error(error);
        this.toast.show('Ошибка при добавлении комментария', 'error');
        return of(null);
      }),
    );
  }

  deleteComment(id: string): Observable<Comment | null> {
    const token = localStorage.getItem('VXNlcklk');

    if (!token) {
      this.toast.show('Вы не авторизованы', 'error');
      return of(null);
    }

    return this.commentsApiService.deleteComment(token, id).pipe(
      tap(() => {
        this.toast.show('Комментарий удалён', 'success');
      }),
      catchError((error) => {
        console.error(error);
        this.toast.show('Ошибка при удалении комментария', 'error');
        return of(null);
      }),
    );
  }

  editComment(id: string, text: string): Observable<Comment | null> {
    const token = localStorage.getItem('VXNlcklk');

    if (!token) {
      this.toast.show('Вы не авторизованы', 'error');
      return of(null);
    }

    return this.commentsApiService.editComment(token, id, text).pipe(
      tap(() => this.toast.show('Комментарий изменён', 'success')),
      catchError((error) => {
        console.error(error);
        this.toast.show('Ошибка при редактировании комментария', 'error');
        return of(null);
      }),
    );
  }
}
