import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor() { }

  public options: any[];
  private cache = new Map();

  public set(value: string) {
    const key = value.slice(0, value.indexOf('.'));
    this.cache.set(key, value);
  }

  public getByUrl(url: string): any[] | boolean {
    const obj = this.options.find(item => item.url === url);
    const result = [];
    let isNull = true;
    for (const key of obj.ticket) {
      if (this.cache.get(key)) {
        isNull = false;
        result.push(this.cache.get(key));
      }
    }
    return isNull ? false : result;
  }

  public includes(url: string): boolean {
    for (const option of this.options) {
      if (option.url === url) {
        return true;
      }
    }
    return false;
  }
}
