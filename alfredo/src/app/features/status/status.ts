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
  welcomeMessage = 'Generating welcome message...';

  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.userName = this.configService.get<string>('user_name');
    this.generateWelcomeMessage();
  }

  private async generateWelcomeMessage(): Promise<void> {
    const name = this.userName || 'friend';
    let prompt = `Please generate a welcome message, one line, welcoming the user ${name} to the Alfred application. Feel free to be jovial.`;

    if (Math.random() < 0.3) {
      prompt += ' Feel free to mix in other languages.';
    }

    prompt += ` Example: Hello ${name}! Alfredo is ready for your input. (Request time: ${Date.now()})`;

    try {
      this.welcomeMessage = await this.aiService.generateText(prompt, 0.9);
    } catch (error) {
      console.error('Failed to generate welcome message:', error);
      this.welcomeMessage = `Welcome, ${name}!`;
    }
  }

  async downloadState() {
    const dbData = await this.databaseService.exportDb();
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
