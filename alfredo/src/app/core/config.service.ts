import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private databaseService: DatabaseService) { }

  private async waitForDbReady(): Promise<boolean> {
    return firstValueFrom(
      this.databaseService.dbReady$.pipe(filter(isReady => isReady))
    );
  }

  public async set(key: string, value: any): Promise<void> {
    await this.waitForDbReady();
    const db = this.databaseService.getDb();
    if (!db) {
      throw new Error('Database not initialized');
    }
    const strValue = JSON.stringify(value);
    db.run('INSERT OR REPLACE INTO Configuration (key, value) VALUES (?, ?)', [key, strValue]);
    this.databaseService.notifyDbModified();
  }

  public get<T>(key: string): T | undefined {
    const db = this.databaseService.getDb();
    if (!db) {
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
    await this.waitForDbReady();
    return this.get<boolean>('setup_complete') || false;
  }

  public async importDatabase(dbFile: File): Promise<void> {
    await this.databaseService.importDb(dbFile);
  }
}
