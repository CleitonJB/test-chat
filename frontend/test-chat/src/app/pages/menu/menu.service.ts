import { Injectable } from '@angular/core';
import { UserInfo } from 'src/app/models/user-info';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private groups: any[] = [];

  constructor(
    private loginService: LoginService
  ) {
    this.setGroups();
  }

  private setGroups(): void {
    this.loginService.getCurrentUser().subscribe((currentUser: UserInfo) => {
      switch(currentUser.userName) {
        case 'Cleiton':
          this.groups = [
            {
              id:   '1',
              name: 'Grupo 1',
            },
            {
              id:   '2',
              name: 'Grupo 2',
            },
          ];
        break;

        case 'Amaro':
          this.groups = [
            {
              id:   '1',
              name: 'Grupo 1',
            }
          ];
        break;

        case 'Lucas':
          this.groups = [
            {
              id:   '1',
              name: 'Grupo 1',
            },
            {
              id:   '2',
              name: 'Grupo 2',
            },
          ];
        break;

        default:
          this.groups = [
            {
              id:   '1',
              name: 'Grupo 1',
            },
            {
              id:   '2',
              name: 'Grupo 2',
            },
            {
              id:   '3',
              name: 'Grupo 3',
            }
          ];
        break;
      }
    });
  }

  public getGroups(): any[] {
    return this.groups;
  }

  public getGroupByID(groupId: string) {
    return this.groups.find(group => group.id == groupId);
  }
}
