import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * A service for managing application configuration settings.
 * It provides a simple key-value store interface, backed by the
 * SQLite database.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private databaseService: DatabaseService) { }

  /**
   * Waits until the database is ready.
   * @returns A promise that resolves to true when the database is initialized.
   */
  private async waitForDbReady(): Promise<boolean> {
    return firstValueFrom(
      this.databaseService.dbReady$.pipe(filter(isReady => isReady))
    );
  }

  /**
   * Sets a configuration value.
   * @param key The configuration key.
   * @param value The value to store. The value will be JSON.stringified.
   */
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

  /**
   * Retrieves a configuration value.
   * @param key The configuration key.
   * @returns The parsed value, or undefined if the key is not found or the DB is not ready.
   */
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

  /**
   * Checks if the initial application setup has been completed.
   * @returns A promise that resolves to true if setup is complete, otherwise false.
   */
  public async isSetupComplete(): Promise<boolean> {
    await this.waitForDbReady();
    return this.get<boolean>('setup_complete') || false;
  }

  /**
   * Triggers the import of a database file via the DatabaseService.
   * @param dbFile The database file to import.
   */
  public async importDatabase(dbFile: File): Promise<void> {
    await this.databaseService.importDb(dbFile);
  }
}
