import { Injectable, inject } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private generativeAI!: GoogleGenerativeAI;
  private configService = inject(ConfigService);
  private initializePromise: Promise<void>;

  constructor() {
    this.initializePromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const config = await firstValueFrom(
        this.configService.config$.pipe(filter(c => !!c && !!c.geminiApiKey))
      );
      this.generativeAI = new GoogleGenerativeAI(config!.geminiApiKey!);
    } catch (error) {
      console.error('Failed to initialize AiService:', error);
      throw error;
    }
  }

  async generateText(prompt: string): Promise<string> {
    await this.initializePromise;
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
