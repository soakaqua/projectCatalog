import { ChangeDetectorRef, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MovieService } from '../movie-service';
import { IMovie, IMovieGenre, MovieApiResponse } from '../imovie';

interface MovieListItem extends IMovie {
  genreNames: string[];
  isLoadingGenres: boolean;
}

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
  movieList: MovieListItem[] = [];
  currentPage = 1;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loadMovies']?.currentValue === true) {
      this.loadMovieList();
    }
  }

  private loadMovieList(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.movieService.getMovieList(page).subscribe({
      next: (movieApiResponse: MovieApiResponse) => {
        this.movieList = movieApiResponse.results.map((movie) => ({
          ...movie,
          genreNames: [],
          isLoadingGenres: true,
        }));
        this.currentPage = movieApiResponse.page;
        this.totalPages = movieApiResponse.total_pages;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
        this.loadMovieGenres(this.movieList);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load movies.';
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  private loadMovieGenres(movies: MovieListItem[]): void {
    if (movies.length === 0) {
      return;
    }

    this.movieService.getGenreList().subscribe({
      next: (genres: IMovieGenre[]) => {
        const genresById = new Map(genres.map((genre) => [genre.id, genre.name]));
        for (const movie of movies) {
          movie.genreNames = movie.genre_ids
            .map((genreId) => genresById.get(genreId))
            .filter((name): name is string => name !== undefined);
          movie.isLoadingGenres = false;
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        for (const movie of movies) {
          movie.isLoadingGenres = false;
        }
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  changePage(page: number): void {
    if (this.isLoading || page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.loadMovieList(page);
  }
}
