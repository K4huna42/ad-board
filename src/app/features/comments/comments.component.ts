import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Comment } from './domains/comment.interface';
import { RussianDatePipe } from '../../shared/pipes/russian-date.pipe';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentsService } from './services/comments.service';
import { UserDataApiService } from '../../shared/services/user-data-api.service';

@Component({
  selector: 'app-comments',
  imports: [RussianDatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @Input() comments: Comment[] = [];
  @Input() advertId!: string;
  @Output() delete = new EventEmitter<string>();

  private fb = inject(FormBuilder);
  private commentsService = inject(CommentsService);
  private userDataApiService = inject(UserDataApiService);

  commentForm: FormGroup;

  userData = this.userDataApiService.userData;
  editingCommentId: string | null = null;
  editText = '';

  constructor() {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    console.log(this.userData()?.id);
  }

  submitComment() {
    if (this.commentForm.invalid) return;

    const formData = new FormData();
    formData.append('text', this.commentForm.get('text')?.value);

    this.commentsService.createComment(this.advertId, formData).subscribe((newComment) => {
      if (newComment) {
        this.comments = [newComment, ...this.comments];

        this.commentForm.reset();
      }
    });
  }

  onDelete(commentId: string) {
    this.delete.emit(commentId);
  }

  startEdit(comment: Comment) {
    this.editingCommentId = comment.id;
    this.editText = comment.text;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editText = '';
  }

  saveEdit(commentId: string) {
    if (!this.editText.trim()) return;
    this.commentsService.editComment(commentId, this.editText).subscribe((updated) => {
      if (updated) {
        this.comments = this.comments.map((c) =>
          c.id === commentId ? { ...c, text: updated.text } : c,
        );
        this.cancelEdit();
      }
    });
  }
}
