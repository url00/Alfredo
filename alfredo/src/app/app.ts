import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The root component of the Alfredo application.
 * It serves as the main container for the application's views.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'alfredo';
}
