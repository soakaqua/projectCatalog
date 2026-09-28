import { Component, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MovieList } from './movie-list/movie-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MovieList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  showMovieList: boolean = false;
  
  toggleMovieList() {
    this.showMovieList = true;
  }

}
