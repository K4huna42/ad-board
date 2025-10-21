import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertService } from '../../shared/services/advert.service';
import { CommonModule } from '@angular/common';
import { ImageComponent } from '../../shared/components/smart/images/images.component';
import { CommentsService } from '../comments/services/comments.service';
import { Comment } from '../comments/domains/comment.interface';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  standalone: true,
  selector: 'app-advert-view',
  imports: [CommonModule, ImageComponent, CommentsComponent],
  templateUrl: './advert-view.component.html',
  styleUrl: './advert-view.component.scss',
})
export class AdvertViewComponent implements OnInit {
  advertId = '';
  visible = false;
  comments: WritableSignal<Comment[]> = signal([]);

  private activatedRoute = inject(ActivatedRoute);
  private advertService = inject(AdvertService);
  private commentsService = inject(CommentsService);

  responceAdvertId = this.advertService.responceAdvertId;

  constructor() {
    effect(() => {
      this.visible = this.advertService.visibleAdvertPopUp();
    });
  }

  ngOnInit(): void {
    this.advertId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    this.showAdvert();
    this.loadComments(this.advertId);
  }

  showAdvert() {
    this.advertService.getAdvertByid(this.advertId);
  }

  closePopUp() {
    this.advertService.changeVisible(false);
  }

  openPopUp() {
    this.advertService.changeVisible(true);
  }

  loadComments(id: string) {
    this.commentsService.getAllThisComments(id).subscribe((value: Comment[]) => {
      this.comments.set(value);
    });
  }

  deleteComment(commentId: string) {
    this.commentsService.deleteComment(commentId).subscribe(() => {
      this.comments.update((list) => list.filter((c) => c.id !== commentId));
    });
  }
}
