import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MovieService } from './movie-service';
import { MovieApiResponse } from './imovie';

describe('MovieService', () => {
  let service: MovieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request the requested page from TMDB', () => {
    const response: MovieApiResponse = {
      page: 3,
      results: [{ id: 1, title: 'Inception' } as any],
      total_pages: 8,
      total_results: 160,
    };

    service.getMovieList(3).subscribe((result) => {
      expect(result).toEqual(response);
    });

    const request = httpTestingController.expectOne((req) =>
      req.url === 'https://api.themoviedb.org/3/discover/movie' && req.params.get('page') === '3'
    );
    expect(request.request.params.get('vote_count.gte')).toBe('800');
    expect(request.request.params.get('sort_by')).toBe('vote_average.desc');
    request.flush(response);
  });
});
