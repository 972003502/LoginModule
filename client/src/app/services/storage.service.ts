import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }
  public localLength = localStorage.length;
  public sessionLength = sessionStorage.length;

  public get(object: string, key: string): string {
    if (object === 'local') {
      return localStorage.getItem(key);
    } else if (object === 'session') {
      return sessionStorage.getItem(key);
    } else { return; }
  }

  public getAll(object: string): string[] {
    const arr = [];
    if (object === 'local') {
      for (const key in localStorage) {
        if (!localStorage.hasOwnProperty(key)) {
          continue;
        }
        arr.push([key, localStorage.getItem(key)]);
      }
      return arr;
    } else if (object === 'session') {
      for (const key in sessionStorage) {
        if (!sessionStorage.hasOwnProperty(key)) {
          continue;
        }
        arr.push([key, sessionStorage.getItem(key)]);
      }
      return arr;
    } else { return; }
  }

  public set(object: string, key: string, value: string): void {
    if (object === 'local') {
      return localStorage.setItem(key, value);
    } else if (object === 'session') {
      return sessionStorage.setItem(key, value);
    } else { return; }
  }

  public remove(object: string, key: string): void {
    if (object === 'local') {
      return localStorage.removeItem(key);
    } else if (object === 'session') {
      return sessionStorage.removeItem(key);
    } else { return; }
  }

  public clear(object: string): void {
    if (object === 'local') {
      return localStorage.clear();
    } else if (object === 'session') {
      return sessionStorage.clear();
    } else { return; }
  }
}
