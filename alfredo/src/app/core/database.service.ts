import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const DB_STORAGE_KEY = 'alfredo_database';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | undefined;
  private dbReadyState$ = new BehaviorSubject<boolean>(false);
  public dbReady$: Observable<boolean> = this.dbReadyState$.asObservable();
  private dbModified$ = new Subject<void>();

  constructor() {
    this.initDatabase();
    // Auto-save the database to local storage with a debounce
    this.dbModified$.pipe(debounceTime(2000)).subscribe(() => this.saveDatabase());
  }

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

  public getDb(): Database | undefined {
    return this.db;
  }

  public notifyDbModified(): void {
    this.dbModified$.next();
  }

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

  public exportDb(): Uint8Array | undefined {
    return this.db?.export();
  }

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
