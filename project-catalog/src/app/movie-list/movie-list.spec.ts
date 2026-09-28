import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { MovieList } from './movie-list';
import { MovieService } from '../movie-service';

describe('MovieList', () => {
  let component: MovieList;
  let fixture: ComponentFixture<MovieList>;
  let getMovieList: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getMovieList = vi.fn((page: number = 1) => of({
      page,
      results: [],
      total_pages: 3,
      total_results: 60,
    }));

    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [{ provide: MovieService, useValue: { getMovieList } }],
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
    expect(fixture.nativeElement.textContent).toContain('Page 2 of 3');
  });
});
