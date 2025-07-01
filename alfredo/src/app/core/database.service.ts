import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';
import { StorageService } from './storage.service';

/**
 * Manages the import and export of application data to/from a SQLite file.
 */
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private storageService: StorageService) {}

  public async exportDb(): Promise<Uint8Array | undefined> {
    try {
      const SQL = await initSqlJs({ locateFile: () => `sql-wasm.wasm` });
      const db = new SQL.Database();
      db.run('CREATE TABLE Configuration (key TEXT PRIMARY KEY, value TEXT)');

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = this.storageService.get<any>(key);
          if (value !== null) {
            db.run('INSERT INTO Configuration (key, value) VALUES (?, ?)', [
              key,
              JSON.stringify(value)
            ]);
          }
        }
      }

      return db.export();
    } catch (err) {
      console.error('Error exporting database:', err);
      return undefined;
    }
  }

  public async importDb(dbFile: File): Promise<void> {
    try {
      const buffer = await dbFile.arrayBuffer();
      const SQL = await initSqlJs({ locateFile: () => `sql-wasm.wasm` });
      const importedDb = new SQL.Database(new Uint8Array(buffer));

      const res = importedDb.exec('SELECT key, value FROM Configuration');
      if (res.length > 0) {
        this.storageService.clear();
        res[0].values.forEach(row => {
          const key = row[0] as string;
          const value = JSON.parse(row[1] as string);
          this.storageService.set(key, value);
        });
      }

      window.location.reload();
    } catch (err) {
      console.error('Error importing database:', err);
    }
  }

  public deleteDatabase(): void {
    this.storageService.clear();
  }
}
