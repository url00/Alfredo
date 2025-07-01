import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetupCompleteGuard implements CanActivate {

  constructor(private configService: ConfigService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return of(this.configService.isSetupComplete()).pipe(
      map(isComplete => {
        if (isComplete) {
          return true;
        } else {
          this.router.navigate(['/setup']);
          return false;
        }
      })
    );
  }
}
