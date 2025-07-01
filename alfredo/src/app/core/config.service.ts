import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Config } from './models/config.model';
import { StorageService } from './storage.service';
import { DatabaseService } from './database.service';

/**
 * A service for managing application configuration settings.
 * It provides a simple key-value store interface, backed by the
 * SQLite database.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configSubject = new BehaviorSubject<Config | null>(null);
  public config$ = this.configSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private databaseService: DatabaseService
    ) {
    this.loadConfig();
  }

  private loadConfig(): void {
    const config: Config = {
      userName: this.get<string>('user_name'),
      userEmail: this.get<string>('user_email'),
      geminiApiKey: this.get<string>('gemini_api_key')
    };
    this.configSubject.next(config);
  }

  /**
   * Sets a configuration value.
   * @param key The configuration key.
   * @param value The value to store. The value will be JSON.stringified.
   */
  public set(key: string, value: any): void {
    this.storageService.set(key, value);
    this.loadConfig();
  }

  /**
   * Retrieves a configuration value.
   * @param key The configuration key.
   * @returns The parsed value, or undefined if the key is not found.
   */
  public get<T>(key: string): T | undefined {
    const value = this.storageService.get<T>(key);
    return value === null ? undefined : value;
  }

  /**
   * Checks if the initial application setup has been completed.
   * @returns true if setup is complete, otherwise false.
   */
  public isSetupComplete(): boolean {
    return this.get<boolean>('setup_complete') || false;
  }

  /**
   * Triggers the import of a database file via the DatabaseService.
   * @param dbFile The database file to import.
   */
  public async importDatabase(dbFile: File): Promise<void> {
    await this.databaseService.importDb(dbFile);
  }

  public updateConfig(config: Partial<Config>): void {
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        this.set(key, config[key as keyof Config]);
      }
    }
  }
}
