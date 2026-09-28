import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MovieApiResponse } from './imovie';
import { Observable } from 'rxjs';

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

    getMovieList(): Observable<MovieApiResponse> {
        return this.http.get<MovieApiResponse>('https://api.themoviedb.org/3/discover/movie?page=1&vote_count.gte=800&sort_by=vote_average.desc', {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTU4OTkyODY1OWJkMGEzMDc4ZjU0MTYxZGM0NWIxZSIsIm5iZiI6MTc4Njk2NzQ3NS42Mywic3ViIjoiNmE4MmY1YjMyNjE0ODE0OWRlNzY5MThkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.gM-7BCmFYuXiQCzJVjoUBbaHfxENdtPU5YtdvDdxBgQ',
                accept: 'application/json',
            },
        });
    }
}
