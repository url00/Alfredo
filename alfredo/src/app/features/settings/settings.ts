import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfigService } from '../../core/config.service';
import { DatabaseService } from '../../core/database.service';
import { User } from '../../core/models/user.model';
import { Config } from '../../core/models/config.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  // user model
  user: User = { name: '', email: '' };
  // config model
  config: Config = { geminiApiKey: '' };

  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService
  ) {}

  ngOnInit(): void {
    this.configService.config$.subscribe(config => {
      if (config) {
        this.user = { name: config.userName ?? '', email: config.userEmail ?? '' };
        this.config = { geminiApiKey: config.geminiApiKey };
      }
    });
  }

  saveSettings(): void {
    this.configService.set('user_name', this.user.name);
    this.configService.set('user_email', this.user.email);
    this.configService.set('gemini_api_key', this.config.geminiApiKey);
  }

  async deleteData(): Promise<void> {
    if (confirm('Are you sure you want to delete all application data? This action cannot be undone.')) {
      await this.databaseService.deleteDatabase();
      // This will trigger the setup guard and redirect to the setup wizard
      window.location.reload();
    }
  }
}
