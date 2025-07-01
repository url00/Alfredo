import { Component, Injector, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfigService } from './core/config.service';

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

  constructor(
    private injector: Injector,
    private configService: ConfigService
  ) {
    if (isDevMode()) {
      (window as any).ng = {
        get: (token: any) => this.injector.get(token),
        ConfigService
      };
    }
  }
}
