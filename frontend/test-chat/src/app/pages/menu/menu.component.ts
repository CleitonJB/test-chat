import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/models/user-info';
import { ConversaService } from '../conversa/conversa.service';
import { LoginService } from '../login/login.service';

import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public groups: any[];

  constructor(
    private router: Router,
    private menuService: MenuService,
    private loginService: LoginService,
    private conversaService: ConversaService
  ) { 
    this.groups = [];
  }

  ngOnInit(): void {
    this.getGroups();
  }

  private getGroups(): void {
    this.groups = this.menuService.getGroups();
  }

  public enterGroup(groupId: string): void {
    this.loginService.getCurrentUser().subscribe(
      currentUser => {
        debugger
        const currentGroup = this.menuService.getGroupByID(groupId);
        const model: UserInfo = new UserInfo(currentGroup.name, currentUser.userName);

        this.conversaService.enterGroup(model).then(
          response => {
            debugger
            if(response) {
              this.conversaService.receiveMessages();
              this.navigateToConversa(groupId);
            } else {
              alert("Erro ao entrar no grupo");
            }
          }, error => {
            alert("Erro ao entrar no grupo (2)");
            console.error(error);
          }
        );
      }
    );
  }

  private navigateToConversa(groupId: string): void {
    this.router.navigate(['conversa', groupId]);
  }
}