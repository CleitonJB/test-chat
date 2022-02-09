import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EMessageType } from 'src/app/models/message';
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

  public privateMessageForm: FormGroup;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private loginService: LoginService,
    private conversaService: ConversaService
  ) { 
    this.groups = [];
    this.privateMessageForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.setInitialForm();
    this.conversaService.setUserConnection().then(() => {
      this.getNotifications();
      this.getGroups();
      this.getPrivateMessages();
    });
  }

  private getPrivateMessages(): void {
    this.conversaService.receivePrivateMessages();
  }

  private getNotifications(): void {
    this.conversaService.getNotification();
  }

  private getGroups(): void {
    this.groups = this.menuService.getGroups();
  }

  private setInitialForm(): void {
    this.privateMessageForm = new FormGroup({
      userName:  new FormControl(null),
      toUserId:  new FormControl(null),
      content:   new FormControl(null),
      type:      new FormControl(EMessageType.Text),
    });
  }

  public sendPrivateMessage(): void {
    this.loginService.getCurrentUser().subscribe(
      (userInfo: UserInfo) => {
        this.privateMessageForm.controls['userName'].setValue(userInfo.userName);

        this.conversaService.sendMessagePrivate(this.privateMessageForm.value);
      }, error => {
        console.error(error);
      }
    );
  }

  public enterGroup(groupId: string): void {
    this.loginService.getCurrentUser().subscribe(
      currentUser => {
        const currentGroup = this.menuService.getGroupByID(groupId);
        const model: UserInfo = new UserInfo(currentGroup.name, currentUser.userName);

        this.conversaService.enterGroup(model).then(
          response => {
  
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