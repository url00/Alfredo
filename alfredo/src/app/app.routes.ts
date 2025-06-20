import { Routes } from '@angular/router';
import { SetupWizardComponent } from './features/setup-wizard/setup-wizard';
import { SetupCompleteGuard } from './core/auth/setup-complete-guard';
import { StatusComponent } from './features/status/status';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupWizardComponent
  },
  {
    path: '',
    component: StatusComponent,
    canActivate: [SetupCompleteGuard]
  }
];
