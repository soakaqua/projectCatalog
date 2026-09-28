import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MovieService } from '../movie-service';
import { IMovie, MovieApiResponse } from '../imovie';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnChanges {
  movieService = inject(MovieService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  @Input() loadMovies = false;
  movieList: IMovie[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loadMovies']?.currentValue === true) {
      this.loadMovieList();
    }
  }

  private loadMovieList(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovieList().subscribe({
      next: (movieApiResponse: MovieApiResponse) => {
        this.movieList = movieApiResponse.results;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load movies.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
