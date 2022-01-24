import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private groups: any[] = [
    {
      name: 'Grupo 1',
      id: '1'
    },
    {
      name: 'Grupo 2',
      id: '2'
    },
    {
      name: 'Grupo 3',
      id: '3'
    }
  ];

  constructor() { }

  public getGroups(): any[] {
    return this.groups;
  }
}
