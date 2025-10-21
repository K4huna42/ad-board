import { Component, inject, OnInit } from '@angular/core';
import { CommentsService } from './services/comments.service';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {

  private commentsService = inject(CommentsService)

  ngOnInit(): void {

  }


}
