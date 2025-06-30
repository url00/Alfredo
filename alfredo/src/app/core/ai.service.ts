import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiKey: string | undefined;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.configService.config$.subscribe(config => {
      if (config) {
        this.apiKey = config.geminiApiKey;
      }
    });
  }

  public async runPrompt(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured.');
    }

    const url = `${GEMINI_API_URL}?key=${this.apiKey}`;
    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    const response = await firstValueFrom(this.http.post<any>(url, body));
    return response.candidates[0].content.parts[0].text;
  }
}
