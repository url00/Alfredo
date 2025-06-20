import { Injectable } from '@angular/core';
import initSqlJs, { Database } from 'sql.js';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db: Database | undefined;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `/${file}`
      });
      this.db = new SQL.Database();
      // You can run initial setup queries here if needed
      // For example: this.db.run("CREATE TABLE test (col1, col2);");
      console.log('Database initialized');
    } catch (err) {
      console.error('Error initializing database:', err);
    }
  }

  public getDb(): Database | undefined {
    return this.db;
  }
}
