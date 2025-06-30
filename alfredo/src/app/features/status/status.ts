import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../../core/database.service';
import { ConfigService } from '../../core/config.service';
import { AiService } from '../../core/ai.service';
import { Subject, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './status.html',
  styleUrls: ['./status.scss']
})
export class StatusComponent implements OnInit {
  userName: string | undefined;
  private aiService = inject(AiService);
  private promptSubject = new Subject<void>();
  aiResult$ = this.promptSubject.asObservable().pipe(
    switchMap(() => from(this.aiService.generateText('Without adding any additional text, please return the result of the expression 2+2')))
  );

  constructor(
    private databaseService: DatabaseService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.userName = this.configService.get<string>('user_name');
  }

  runAiPrompt() {
    this.promptSubject.next();
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
