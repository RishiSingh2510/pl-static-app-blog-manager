import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlogPost } from '../../shared/interfaces/blog-post.interface';

@Component({
  selector: 'post-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
   @Input() public post!: BlogPost;
   @Output() public editEmitter = new EventEmitter<void>();
   @Output() public deleteEmitter = new EventEmitter<void>();
}
