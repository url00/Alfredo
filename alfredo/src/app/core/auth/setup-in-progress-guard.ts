import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetupInProgressGuard implements CanActivate {

  constructor(private configService: ConfigService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return from(this.configService.isSetupComplete()).pipe(
      map(isComplete => {
        if (isComplete) {
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
