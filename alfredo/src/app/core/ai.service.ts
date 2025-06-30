import { Injectable, inject } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { from } from 'rxjs';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private generativeAI!: GoogleGenerativeAI;
  private configService = inject(ConfigService);

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    const config = await firstValueFrom(
      this.configService.config$.pipe(filter(c => c !== null))
    );
    this.generativeAI = new GoogleGenerativeAI(config!.geminiApiKey!);
  }

  generateText(prompt: string) {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return from(model.generateContent(prompt).then(result => result.response.text()));
  }
}
