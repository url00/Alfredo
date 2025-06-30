import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../../core/database.service';
import { ConfigService } from '../../core/config.service';
import { AiService } from '../../core/ai.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './status.html',
  styleUrls: ['./status.scss']
})
export class StatusComponent implements OnInit {
  userName: string | undefined;
  welcomeMessage: string | undefined;

  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.userName = this.configService.get<string>('user_name');
    this.aiService.runPrompt('Generate a short, friendly welcome message for a user named ' + this.userName)
      .then(message => this.welcomeMessage = message);
  }

  downloadState() {
    const dbData = this.databaseService.exportDb();
    if (dbData) {
      const blob = new Blob([dbData], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alfredo.db';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
