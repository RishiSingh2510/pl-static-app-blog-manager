import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, finalize, Observable, tap, throwError } from "rxjs";

@Injectable()
export class ApiService {
    private readonly url = 'https://localhost:44382/api/';
    private readonly http = inject(HttpClient);

    public get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.url}${endpoint}`);
    }

    public post<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.post<T>(`${this.url}${endpoint}`, body);
    }

    public put<T>(endpoint: string, body: unknown): Observable<T> {
        return this.http.put<T>(`${this.url}${endpoint}`, body);
    }
    
    public delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.url}${endpoint}`);
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error);
    }

    public handleResponse<D>(loader$: BehaviorSubject<boolean>, request: Observable<D>): Observable<D> {
        loader$.next(true);
        return request.pipe(
            catchError((error: HttpErrorResponse) => {
                loader$.next(false);
                return throwError(() => error);
            }),
            tap(() => loader$.next(false)),
            finalize(() => loader$.next(false))
        );
    }
}