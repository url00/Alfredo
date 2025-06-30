import { test, expect } from '@playwright/test';
import { AiService } from '../src/app/core/ai.service';
import { ConfigService } from '../src/app/core/config.service';
import { DatabaseService } from '../src/app/core/database.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

test.describe('AI Service Integration', () => {
  test('should get a response from the Gemini API', async () => {
    // This test requires a valid Gemini API key to be set as an environment variable
    // For example, in a .env file:
    // GEMINI_API_KEY=your_api_key_here
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('Skipping AI integration test: GEMINI_API_KEY environment variable not set.');
      return;
    }

    // Manually instantiate the services
    const databaseService = new DatabaseService();
    const configService = new ConfigService(databaseService);
    const httpClient = new HttpClient({} as HttpHandler);
    const aiService = new AiService(httpClient, configService);

    // Set the API key
    await configService.set('gemini_api_key', apiKey);

    // Run a prompt
    const response = await aiService.runPrompt('say hello');

    // Check the response
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(0);
  });
});
