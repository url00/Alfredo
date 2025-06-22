import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { ConfigService } from './app/core/config.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(App, appConfig)
  .then(appRef => {
    if (!environment.production) {
      (window as any).ng = {
        get: (token: any) => appRef.injector.get(token),
        resolve: (token: any) => appRef.injector.get(token),
        ConfigService: ConfigService
      };
    }
  })
  .catch((err) => console.error(err));
