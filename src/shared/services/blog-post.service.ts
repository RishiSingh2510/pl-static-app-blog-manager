import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { BlogPost } from "../interfaces/blog-post.interface";
import { ApiService } from "./api.service";

@Injectable()
export class BlogPostService {
    private readonly apiService = inject(ApiService);
    private readonly baseUrl = 'BlogPost';
    private readonly posts$ = new BehaviorSubject<Array<BlogPost>>([]);
    private loader$ = new BehaviorSubject<boolean>(false);

    /**
     * Gets an observable stream of blog posts.
     * 
     * @returns {Observable<Array<BlogPost>>} An observable that emits an array of BlogPost objects.
     */
    public get posts(): Observable<Array<BlogPost>> {
        return this.posts$.asObservable();
    }

    public get postValues(): Array<BlogPost> {
        return this.posts$.getValue();
    }

    /**
     * Retrieves a list of blog posts from the API.
     *
     * @returns {Observable<Array<BlogPost>>} An observable that emits an array of blog posts.
     */
    public getPosts(): Observable<Array<BlogPost>> {
        return this.handleResponse(
            this.apiService.get<Array<BlogPost>>(`${this.baseUrl}`).pipe(
                tap((posts) => this.setPosts(posts))
            )
        );
    }

    /**
     * Retrieves a blog post by its unique identifier.
     * 
     * @param id - The unique identifier of the blog post.
     * @returns An Observable that emits the retrieved BlogPost.
     */
    public getPostById(id: number): Observable<BlogPost> {
        return this.handleResponse(
            this.apiService.get<BlogPost>(`${this.baseUrl}/${id}`)
        );
    }

    /**
     * Creates a new blog post.
     * 
     * @param post - The blog post to be created.
     * @returns An Observable that emits the created blog post.
     */
    public createPost(post: BlogPost): Observable<BlogPost> {
        return this.handleResponse(
            this.apiService.post<BlogPost>(`${this.baseUrl}`, post).pipe(
                tap((newPost) => this.addToState(newPost))
            )
        );
    }

    /**
     * Updates an existing blog post.
     * 
     * @param post - The blog post to update.
     * @returns An Observable that emits the updated blog post.
     */
    public updatePost({ id, text }: Partial<BlogPost>): Observable<BlogPost> {
        const post = this.posts$.getValue().find((p) => p.id === id);
        return this.handleResponse(
            this.apiService.put<BlogPost>(`${this.baseUrl}/${id}`, {
                ...post,
                text
            }).pipe(
                tap((updatedPost) => this.updateInState(updatedPost))
            )
        );
    }

    /**
     * Deletes a blog post by its ID.
     *
     * @param id - The ID of the blog post to delete.
     * @returns An Observable that emits a boolean indicating whether the deletion was successful.
     */
    public deletePost(id: number): Observable<boolean> {
        return this.handleResponse(
            this.apiService.delete<boolean>(`${this.baseUrl}/${id}`).pipe(
                tap(() => this.deleteFromState(id))
            )
        );
    }

    /**
     * Updates the list of blog posts and emits the new list to all subscribers.
     *
     * @param posts - An array of `BlogPost` objects representing the new list of blog posts.
     * @returns void
     */
    public setPosts(posts: Array<BlogPost>): void {
        this.posts$.next(posts);
    }

    /**
     * Adds a new blog post to the current state.
     *
     * @param post - The blog post to be added.
     * @private
     */
    private addToState(post: BlogPost): void {
        this.setPosts([...this.posts$.getValue(), post]);
    }

    /**
     * Removes a blog post from the state by its ID.
     *
     * @param id - The ID of the blog post to be removed.
     * @private
     */
    private deleteFromState(id: number): void {
        this.setPosts(this.posts$.getValue().filter((post) => post.id !== id));
    }

    /**
     * Updates the state with the given blog post.
     * 
     * This method finds the blog post in the current state by its ID and replaces it with the provided post.
     * It then emits the updated list of posts to the subscribers.
     * 
     * @param post - The blog post to update in the state.
     */
    private updateInState(post: BlogPost): void {
        this.setPosts(this.posts$.getValue().map((p) => p.id === post.id ? post : p));
    }

    private handleResponse<D>(request: Observable<D>): Observable<D> {
        return this.apiService.handleResponse(this.loader$, request);
    }
}