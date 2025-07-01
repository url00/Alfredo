import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  public get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
      return null;
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data from localStorage', e);
    }
  }

  public clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
}
