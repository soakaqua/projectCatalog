import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IMovieGenre, MovieApiResponse, MovieGenreApiResponse } from './imovie';
import { map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
    // nouvelle façon de faire des requêtes HTTP avec Angular 16
    // private resource: HttpResourceRef<MovieApiResponse | undefined> = httpResource(
    //     () => ({
    //         url: 'https://api.themoviedb.org/3/movie/popular',
    //         headers: {
    //             Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTU4OTkyODY1OWJkMGEzMDc4ZjU0MTYxZGM0NWIxZSIsIm5iZiI6MTc4Njk2NzQ3NS42Mywic3ViIjoiNmE4MmY1YjMyNjE0ODE0OWRlNzY5MThkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gM-7BCmFYuXiQCzJVjoUBbaHfxENdtPU5YtdvDdxBgQ`,
    //             accept: 'application/json'
    //         },
    //     })
    // );

    // getMovieList() {
    //     return computed(() => this.resource.value()?.results ?? []);
    // }

    private http = inject(HttpClient);
    private genreListCache?: IMovieGenre[];
    private genreListRequest?: Observable<IMovieGenre[]>;
    private readonly headers = {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTU4OTkyODY1OWJkMGEzMDc4ZjU0MTYxZGM0NWIxZSIsIm5iZiI6MTc4Njk2NzQ3NS42Mywic3ViIjoiNmE4MmY1YjMyNjE0ODE0OWRlNzY5MThkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gM-7BCmFYuXiQCzJVjoUBbaHfxENdtPU5YtdvDdxBgQ',
        accept: 'application/json',
    };

    getMovieList(page: number = 1): Observable<MovieApiResponse> {
        const params = new HttpParams()
            .set('page', page)
            .set('vote_count.gte', 800)
            .set('sort_by', 'vote_average.desc');

        return this.http.get<MovieApiResponse>('https://api.themoviedb.org/3/discover/movie', {
            params,
            headers: this.headers,
        });
    }

    getGenreList(): Observable<IMovieGenre[]> {
        if (this.genreListCache) {
            return of(this.genreListCache);
        }

        if (!this.genreListRequest) {
            this.genreListRequest = this.http.get<MovieGenreApiResponse>(
                'https://api.themoviedb.org/3/genre/movie/list',
                { headers: this.headers },
            ).pipe(
                map((response) => response.genres),
                tap((genres) => this.genreListCache = genres),
                shareReplay({ bufferSize: 1, refCount: false }),
            );
        }

        return this.genreListRequest;
    }
}
