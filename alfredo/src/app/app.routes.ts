import { Routes } from '@angular/router';
import { SetupWizardComponent } from './features/setup-wizard/setup-wizard';
import { SetupCompleteGuard } from './core/auth/setup-complete-guard';
import { StatusComponent } from './features/status/status';
import { SetupInProgressGuard } from './core/auth/setup-in-progress-guard';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupWizardComponent,
    canActivate: [SetupInProgressGuard]
  },
  {
    path: '',
    component: StatusComponent,
    canActivate: [SetupCompleteGuard]
  }
];
