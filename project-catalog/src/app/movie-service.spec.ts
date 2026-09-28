import { TestBed } from '@angular/core/testing';

import { MovieService } from './movie-service';

describe('MovieService', () => {
  let service: MovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should unwrap the TMDB results array', () => {
    const service = new MovieService();
    (service as any).resource = {
      value: () => ({
        page: 1,
        results: [{ id: 1, title: 'Inception' }],
      }),
    };

    expect(service.getMovieList()()).toEqual([{ id: 1, title: 'Inception' }]);
  });
});
