import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | undefined;
  private dbReady: Promise<void>;

  constructor() {
    this.dbReady = this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `sql-wasm.wasm`
      });
      this.db = new SQL.Database();
      // Create configuration table if it doesn't exist
      this.db.run("CREATE TABLE IF NOT EXISTS Configuration (key TEXT PRIMARY KEY, value TEXT);");
      console.log('Database initialized');
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  public getDb(): Database | undefined {
    return this.db;
  }

  public async isDbReady(): Promise<void> {
    return this.dbReady;
  }

  public exportDb(): Uint8Array | undefined {
    return this.db?.export();
  }

  public async importDb(dbFile: File): Promise<void> {
    const buffer = await dbFile.arrayBuffer();
    const SQL = await initSqlJs({
      locateFile: file => `sql-wasm.wasm`
    });
    this.db = new SQL.Database(new Uint8Array(buffer));
    console.log('Database imported');
  }
}
