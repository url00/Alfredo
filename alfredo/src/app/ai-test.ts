import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AiService } from './core/ai.service';
import { from, map, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-ai-test',
  template: `{{ promptResult$ | async }}`,
  standalone: true,
  imports: [AsyncPipe],
})
export class AiTestComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly aiService = inject(AiService);

  promptResult$ = this.route.queryParams.pipe(
    map(params => params['prompt'] as string),
    switchMap(prompt =>
      from(this.aiService.generateText(prompt)).pipe(
        tap(result => console.log('AI Service Result:', result))
      )
    )
  );
}
