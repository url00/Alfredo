import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private databaseService: DatabaseService) { }

  public async set(key: string, value: any): Promise<void> {
    await this.databaseService.isDbReady();
    const db = this.databaseService.getDb();
    if (!db) {
      throw new Error('Database not initialized');
    }
    const strValue = JSON.stringify(value);
    db.run('INSERT OR REPLACE INTO Configuration (key, value) VALUES (?, ?)', [key, strValue]);
  }

  public get<T>(key: string): T | undefined {
    const db = this.databaseService.getDb();
    if (!db) {
      // This case should ideally not be hit if we await the ready promise,
      // but it's a good safeguard.
      console.error('Get called before DB was ready.');
      return undefined;
    }
    const res = db.exec(`SELECT value FROM Configuration WHERE key = ?`, [key]);
    if (res.length === 0 || res[0].values.length === 0) {
      return undefined;
    }
    return JSON.parse(res[0].values[0][0] as string) as T;
  }

  public async isSetupComplete(): Promise<boolean> {
    await this.databaseService.isDbReady();
    return this.get<boolean>('setup_complete') || false;
  }
}
