import { Injectable } from '@angular/core';

/**
 * A service for interacting with the browser's local storage.
 * It provides a simple key-value store interface.
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Sets a value in local storage.
   * @param key The key for the data.
   * @param value The value to store. The value will be JSON.stringified.
   */
  public set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  /**
   * Retrieves a value from local storage.
   * @param key The key of the data to retrieve.
   * @returns The parsed value, or null if the key is not found or an error occurs.
   */
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

  /**
   * Removes a value from local storage.
   * @param key The key of the data to remove.
   */
  public remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing data from localStorage', e);
    }
  }

  /**
   * Clears all data from local storage.
   */
  public clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }
}
