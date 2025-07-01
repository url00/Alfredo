import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { StorageService } from './storage.service';

const DB_STORAGE_KEY = 'alfredo_database';

/**
 * Manages the application's SQLite database instance for import/export.
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  /** The underlying sql.js Database object. */
  private db: Database | undefined;
  /** BehaviorSubject to track the ready state of the database. */
  private dbReadyState$ = new BehaviorSubject<boolean>(false);
  /** Observable that emits true when the database is ready for use. */
  public dbReady$: Observable<boolean> = this.dbReadyState$.asObservable();

  constructor(private storageService: StorageService) {
    this.initDatabase();
  }

  /**
   * Initializes the database.
   * It creates a new, empty database object.
   */
  private async initDatabase(): Promise<void> {
    try {
      const SQL = await initSqlJs({
        locateFile: () => `sql-wasm.wasm`
      });
      this.db = new SQL.Database();
      // Create configuration table if it doesn't exist
      this.db.run("CREATE TABLE IF NOT EXISTS Configuration (key TEXT PRIMARY KEY, value TEXT);");
      console.log('New database initialized for import/export');
      this.dbReadyState$.next(true);
    } catch (err) {
      console.error('Error initializing database:', err);
      this.dbReadyState$.next(false);
    }
  }

  /**
   * Returns the raw sql.js Database object.
   * @returns The Database object, or undefined if it's not ready.
   */
  public getDb(): Database | undefined {
    return this.db;
  }


  /**
   * Exports the entire database as a Uint8Array.
   * @returns A Uint8Array representing the database file, or undefined.
   */
  public exportDb(): Uint8Array | undefined {
    return this.db?.export();
  }

  /**
   * Imports a database from a user-provided file.
   * This will overwrite the current database and migrate the data to local storage.
   * @param dbFile The .sqlite or .db file to import.
   */
  public async importDb(dbFile: File): Promise<void> {
    this.dbReadyState$.next(false); // Signal that the DB is changing
    try {
      const buffer = await dbFile.arrayBuffer();
      const SQL = await initSqlJs({
        locateFile: () => `sql-wasm.wasm`
      });
      const importedDb = new SQL.Database(new Uint8Array(buffer));
      
      // Migrate data from the imported DB to local storage
      const res = importedDb.exec("SELECT key, value FROM Configuration");
      if (res.length > 0) {
        res[0].values.forEach(row => {
          const key = row[0] as string;
          const value = JSON.parse(row[1] as string);
          this.storageService.set(key, value);
        });
      }

      console.log('Database imported and data migrated to local storage');
      this.dbReadyState$.next(true);
    } catch (err) {
      console.error('Error importing database:', err);
      this.dbReadyState$.next(false);
    }
  }

  /**
   * Deletes all application data from local storage.
   */
  public async deleteDatabase(): Promise<void> {
    this.storageService.clear();
    console.log('All application data cleared from local storage.');
  }
}
