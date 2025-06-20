import { Routes } from '@angular/router';
import { SetupWizardComponent } from './features/setup-wizard/setup-wizard';
import { SetupCompleteGuard } from './core/auth/setup-complete-guard';

export const routes: Routes = [
  {
    path: 'setup',
    component: SetupWizardComponent
  },
  {
    path: '',
    canActivate: [SetupCompleteGuard],
    children: [
      // Your main app routes go here
    ]
  }
];
