import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.generativeAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY']!);
  }

  generateText(prompt: string) {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    return from(model.generateContent(prompt).then(result => result.response.text()));
  }
}
