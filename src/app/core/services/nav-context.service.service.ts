import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavContextService {

  source?: string;
  sourceId?: number;

  set(source: string, id: number) {
    this.source = source;
    this.sourceId = id;
  }

  clear() {
    this.source = undefined;
    this.sourceId = undefined;
  }

}
