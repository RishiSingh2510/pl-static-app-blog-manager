import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, switchMap, take } from 'rxjs';
import { BlogPost } from '../shared/interfaces/blog-post.interface';
import { ApiService } from '../shared/services/api.service';
import { BlogPostService } from '../shared/services/blog-post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe, AsyncPipe, ReactiveFormsModule, HttpClientModule],
  providers: [BlogPostService, ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public readonly blogService = inject(BlogPostService);
  public readonly textControl = new FormControl<string>('', Validators.required);
  public posts$ = this.blogService.posts;
  public selectedPostId: number | undefined = undefined;

  public ngOnInit(): void {
    this.blogService.getPosts().pipe(take(1)).subscribe();
  }

  /**
   * Edit a blog post by its ID.
   * @param param0 - An object containing the ID of the blog post to edit.
   */
  public editPost({ id }: BlogPost): void {
    this.selectedPostId = id;
    this.textControl.setValue(this.blogService.postValues.find((post) => post.id === id)?.text ?? null);
  }

  /**
   * Deletes a blog post by its ID.
   *
   * @param {BlogPost} param0 - An object containing the ID of the blog post to delete.
   * @returns {void}
   */
  public deletePost({ id }: BlogPost): void {
    id && this.blogService.deletePost(id).subscribe();
  }

  /**
   * Saves the current text from the text control as a new blog post.
   * 
   * This method retrieves the current value from the text control, 
   * creates a new blog post with the text, the username 'Me', and the current date,
   * and then sends it to the blog service to be saved.
   * 
   * @returns {void}
   */
  public save(): void {
    of(this.selectedPostId).pipe(
      switchMap((id) => id ? this.blogService.updatePost({ id, text: this.textControl.value as string }) : this.blogService.createPost({ text: this.textControl.value as string, username: 'Demo User', createdAt: new Date() }))
    ).subscribe(() => { this.textControl.setValue(''); this.selectedPostId = undefined; });
  }
}
