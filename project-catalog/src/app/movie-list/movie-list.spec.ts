import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MovieList } from './movie-list';
import { MovieService } from '../movie-service';

describe('MovieList', () => {
  let component: MovieList;
  let fixture: ComponentFixture<MovieList>;
  let getMovieList: ReturnType<typeof vi.fn>;
  let getGenreList: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getMovieList = vi.fn((page: number = 1) => of({
      page,
      results: [{
        id: 1,
        title: 'Inception',
        original_title: 'Inception Original',
        overview: '',
        poster_path: null,
        release_date: '2010-07-16',
        vote_average: 0,
        popularity: 0,
        genre_ids: [28],
      }],
      total_pages: 3,
      total_results: 60,
    }));
    getGenreList = vi.fn(() => of([{ id: 28, name: 'Action' }]));

    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [{ provide: MovieService, useValue: { getMovieList, getGenreList } }],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request and display the next page', async () => {
    fixture.componentRef.setInput('loadMovies', true);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button:last-child').click();
    fixture.detectChanges();

    expect(getMovieList).toHaveBeenNthCalledWith(2, 2);
    expect(getGenreList).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 3');
    expect(fixture.nativeElement.textContent).toContain('Titre original : Inception Original');
    expect(fixture.nativeElement.textContent).toContain('Genres : Action');
  });
});
