import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment.development';
import { Comment } from '../../features/comments/domains/comment.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsApiService {
  private readonly http = inject(HttpClient);

  private getAuthHeaders(token: string): HttpHeaders {
    if (!token) {
      throw new Error('Token not found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createComment(token: string, id: string, form: FormData): Observable<Comment> {
    return this.http.post<Comment>(`${environment.baseApiURL}/Advert/${id}/comments`, form, {
      headers: this.getAuthHeaders(token),
    });
  }

  getAllComments(id: string) {
    return this.http.get<Comment[]>(`${environment.baseApiURL}/Advert/${id}/Comments`);
  }

  deleteComment(token: string, id: string): Observable<Comment> {
    return this.http.delete<Comment>(`${environment.baseApiURL}/Comment/${id}`, {
      headers: this.getAuthHeaders(token),
    });
  }

  editComment(token: string, id: string, text: string): Observable<Comment> {
    return this.http.put<Comment>(
      `${environment.baseApiURL}/Comment/${id}`,
      { text },
      {
        headers: this.getAuthHeaders(token),
      },
    );
  }
}
