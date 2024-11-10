import { AsyncPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, map, of, switchMap, take } from 'rxjs';
import { PostCardComponent } from '../components/post-card/post-card.component';
import { BlogPost } from '../shared/interfaces/blog-post.interface';
import { FilterPipe } from '../shared/pipes/search-filter.pipe';
import { ApiService } from '../shared/services/api.service';
import { BlogPostService } from '../shared/services/blog-post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, FilterPipe, ReactiveFormsModule, HttpClientModule, PostCardComponent],
  providers: [BlogPostService, ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public readonly blogService = inject(BlogPostService);
  public readonly textControl = new FormControl<string>('', Validators.required);
  public readonly sortingControl = new FormControl<string>('newest');
  public readonly searchControl = new FormControl<string>('');
  public readonly posts$ = this.sortingControl.valueChanges.pipe(
    debounceTime(300),
    switchMap(() => this.blogService.posts.pipe(map((posts) => this.sortPosts(posts)))));
  public readonly sortingOptions = [
    {
      label: 'Newest',
      value: 'newest',
      fieldValue: {
        field: 'createdAt',
        sort: 'asc'
      }
    },
    {
      label: 'Oldest',
      value: 'oldest',
      fieldValue: {
        field: 'createdAt',
        sort: 'desc'
      }
    },
    {
      label: 'A-Z',
      value: 'aToZ',
      fieldValue: {
        field: 'text',
        sort: 'asc'
      }
    },
    {
      label: 'Z-A',
      value: 'zToA',
      fieldValue: {
        field: 'text',
        sort: 'desc'
      }
    }
  ]
  public selectedPostId: number | undefined = undefined;

  public get searchValue(): string {
    return this.searchControl.value as string;
  }
  public ngOnInit(): void {
    this.blogService.getPosts().pipe(take(1)).subscribe(()=> this.sortingControl.setValue('newest'));
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

  /**
   * Handles the close event by resetting the selected post ID and clearing the text control value.
   * 
   * @public
   * @returns {void}
   */
  public onClose(): void {
    this.selectedPostId = undefined;
    this.textControl.setValue('');
  }

  /**
   * Sorts an array of blog posts based on the selected sorting option.
   *
   * The sorting options are determined by the `sortingControl` value and can sort by either
   * the `createdAt` date or the `text` field of the blog posts. The sorting order can be
   * ascending or descending.
   *
   * @param posts - The array of blog posts to be sorted.
   * @returns The sorted array of blog posts.
   */
  private sortPosts(posts: Array<BlogPost>): Array<BlogPost> {
    const sortBy = this.sortingOptions.find((option) => option.value === this.sortingControl.value)?.fieldValue;
    return posts.sort((a, b) => {
        if (sortBy?.field === 'createdAt') {
          return sortBy.sort === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy?.field === 'text') {
          return sortBy.sort === 'asc' ? a.text.localeCompare(b.text) : b.text.localeCompare(a.text);
        }
        return 0;
      })
  }
}
