import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | undefined;
  private dbReadyState$ = new BehaviorSubject<boolean>(false);
  public dbReady$: Observable<boolean> = this.dbReadyState$.asObservable();

  constructor() {
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    try {
      const SQL = await initSqlJs({
        locateFile: () => `sql-wasm.wasm`
      });
      this.db = new SQL.Database();
      // Create configuration table if it doesn't exist
      this.db.run("CREATE TABLE IF NOT EXISTS Configuration (key TEXT PRIMARY KEY, value TEXT);");
      console.log('Database initialized');
      this.dbReadyState$.next(true);
    } catch (err) {
      console.error('Error initializing database:', err);
      this.dbReadyState$.next(false);
    }
  }

  public getDb(): Database | undefined {
    return this.db;
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
      this.dbReadyState$.next(true);
    } catch (err) {
      console.error('Error importing database:', err);
      this.dbReadyState$.next(false);
    }
  }
}
