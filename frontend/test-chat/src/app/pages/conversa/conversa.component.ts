import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { MenuService } from '../menu/menu.service';
import { ConversaService } from './conversa.service';
import { EMessageType, Message } from 'src/app/models/message';
import { UserInfo } from 'src/app/models/user-info';
import { filter } from 'rxjs';

@Component({
  selector: 'app-conversa',
  templateUrl: './conversa.component.html',
  styleUrls: ['./conversa.component.scss']
})
export class ConversaComponent implements OnInit {

  public conversaForm: FormGroup;

  public messages: any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private conversaService: ConversaService
  ) {
    this.conversaForm = new FormGroup({});
    this.messages = [];

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url == "/menu") {
        this.conversaService.leaveGroup();
      }
    });
  }

  ngOnInit(): void {
    this.setInitialForm();
    this.setCurrentGroup();
    this.setCurrentUser();
    this.getMessages();
  }

  private setInitialForm(): void {
    this.conversaForm = new FormGroup({
      userName:   new FormControl(null),
      grupoNome:  new FormControl(null),
      content:    new FormControl(null),
    });
  }

  private async setCurrentGroup(): Promise<void> {
    const groupId: string = this.route.snapshot.params['id'];
    const group = await this.menuService.getGroupByID(groupId);
    
    this.conversaForm.controls['grupoNome'].setValue(group.name);

    console.log(this.conversaForm.value);
  }

  private async setCurrentUser(): Promise<void> {
    this.conversaService.getUserInfo().subscribe(
      (userInfo: UserInfo) => {
        this.conversaForm.controls['userName'].setValue(userInfo.userName);
      }, error => {
        console.error(error);
      }
    );
  }

  private getMessages(): void {
    this.conversaService.getMessage().subscribe(
      (messages: Message[]) => {
        console.warn("Nova mensagem (mensagem): ", messages);
        this.messages = messages;
      }
    );
  }

  public onSubmit(): void {
    let messageData: Message & UserInfo = {
      userName:  this.conversaForm.controls['userName'].value,
      groupName: this.conversaForm.controls['grupoNome'].value,
      content:   this.conversaForm.controls['content'].value,
      createdAt: new Date(),
      type:      EMessageType.Text
    }

    //console.log(this.conversaForm.value);

    this.conversaService.sendMessage(messageData);

    this.conversaForm.controls['content'].setValue('');
  }
}