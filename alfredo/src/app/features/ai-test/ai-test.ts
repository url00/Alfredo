import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../core/ai.service';
import { Subject, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-ai-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-test.html',
})
export class AiTestComponent {
  private aiService = inject(AiService);
  private promptSubject = new Subject<void>();
  aiResult$ = this.promptSubject.asObservable().pipe(
    switchMap(() => from(this.aiService.generateText('Without adding any additional text, please return the result of the expression 2+2')))
  );

  runAiPrompt() {
    this.promptSubject.next();
  }
}
