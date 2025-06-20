import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../core/config.service';

@Component({
  selector: 'app-setup-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './setup-wizard.html',
  styleUrls: ['./setup-wizard.scss']
})
export class SetupWizardComponent {
  step = 1;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      geminiApiKey: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.step === 1 && this.form.get('name')?.valid && this.form.get('email')?.valid) {
      this.step++;
    } else if (this.step === 2 && this.form.get('geminiApiKey')?.valid) {
      this.step++;
    }
  }

  prevStep() {
    this.step--;
  }

  async completeSetup() {
    if (this.form.valid) {
      await this.configService.set('user_name', this.form.value.name);
      await this.configService.set('user_email', this.form.value.email);
      await this.configService.set('gemini_api_key', this.form.value.geminiApiKey);
      await this.configService.set('setup_complete', true);
      this.router.navigate(['/']);
    }
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      await this.configService.importDatabase(file);
      await this.configService.set('setup_complete', true);
      this.router.navigate(['/']);
    }
  }
}
