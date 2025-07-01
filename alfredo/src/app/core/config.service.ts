import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Config } from './models/config.model';
import { StorageService } from './storage.service';
import { DatabaseService } from './database.service';

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

  public set(key: string, value: any): void {
    this.storageService.set(key, value);
    this.loadConfig();
  }

  public get<T>(key: string): T | undefined {
    const value = this.storageService.get<T>(key);
    return value === null ? undefined : value;
  }

  public isSetupComplete(): boolean {
    return this.get<boolean>('setup_complete') || false;
  }

  public async importDatabase(dbFile: File): Promise<void> {
    await this.databaseService.importDb(dbFile);
  }

  public updateConfig(config: Partial<Config>): void {
    const configKeyMap: { [key in keyof Config]: string } = {
      userName: 'user_name',
      userEmail: 'user_email',
      geminiApiKey: 'gemini_api_key'
    };

    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        const storageKey = configKeyMap[key as keyof Config];
        if (storageKey) {
          // Set value in storage without triggering a reload
          this.storageService.set(storageKey, config[key as keyof Config]);
        }
      }
    }
    // Reload the config once after all values are updated
    this.loadConfig();
  }
}
