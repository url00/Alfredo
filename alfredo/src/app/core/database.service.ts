import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const DB_STORAGE_KEY = 'alfredo_database';

/**
 * Manages the application's SQLite database instance.
 * This service handles initializing, loading from, and saving to local storage,
 * as well as importing and exporting the database file.
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
  /** Subject that signals when the database has been modified. */
  private dbModified$ = new Subject<void>();

  constructor() {
    this.initDatabase();
    // Auto-save the database to local storage with a debounce
    this.dbModified$.pipe(debounceTime(2000)).subscribe(() => this.saveDatabase());
  }

  /**
   * Initializes the database.
   * It attempts to load an existing database from local storage. If not found,
   * it creates a new database and sets up the initial schema.
   */
  private async initDatabase(): Promise<void> {
    try {
      const SQL = await initSqlJs({
        locateFile: () => `sql-wasm.wasm`
      });
      const savedDb = this.loadDatabase();
      if (savedDb) {
        this.db = new SQL.Database(savedDb);
        console.log('Database loaded from storage');
      } else {
        this.db = new SQL.Database();
        // Create configuration table if it doesn't exist
        this.db.run("CREATE TABLE IF NOT EXISTS Configuration (key TEXT PRIMARY KEY, value TEXT);");
        console.log('New database initialized');
        this.notifyDbModified();
      }
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
   * Notifies the service that the database has been modified.
   * This triggers the debounced auto-save mechanism.
   */
  public notifyDbModified(): void {
    this.dbModified$.next();
  }

  /**
   * Saves the current database to browser's local storage.
   */
  private saveDatabase(): void {
    if (!this.db) return;
    try {
      const data = this.db.export();
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(Array.from(data)));
      console.log('Database saved to local storage');
    } catch (err) {
      console.error('Error saving database to local storage:', err);
    }
  }

  /**
   * Loads the database from browser's local storage.
   * @returns The database as a Uint8Array, or null if not found or an error occurs.
   */
  private loadDatabase(): Uint8Array | null {
    try {
      const savedData = localStorage.getItem(DB_STORAGE_KEY);
      if (savedData) {
        return new Uint8Array(JSON.parse(savedData));
      }
      return null;
    } catch (err) {
      console.error('Error loading database from local storage:', err);
      return null;
    }
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
   * This will overwrite the current database.
   * @param dbFile The .sqlite or .db file to import.
   */
  public async importDb(dbFile: File): Promise<void> {
    this.dbReadyState$.next(false); // Signal that the DB is changing
    try {
      const buffer = await dbFile.arrayBuffer();
      const SQL = await initSqlJs({
        locateFile: () => `sql-wasm.wasm`
      });
      this.db = new SQL.Database(new Uint8Array(buffer));
      console.log('Database imported');
      this.notifyDbModified(); // Save the newly imported DB
      this.dbReadyState$.next(true);
    } catch (err) {
      console.error('Error importing database:', err);
      this.dbReadyState$.next(false);
    }
  }
}
