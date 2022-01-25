import { Injectable } from '@angular/core';

import { HubConnection } from '@microsoft/signalr';
import * as signalr from '@microsoft/signalr';

import { environment } from 'src/environments/environment';

import { Message } from 'src/app/models/message';
import { UserInfo } from 'src/app/models/user-info';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversaService {

  private hubConnection: HubConnection;

  private message: BehaviorSubject<Message[]>;
  private $messages: Observable<Message[]>;

  private userInfo: BehaviorSubject<UserInfo>;

  constructor() {
    this.hubConnection = this.initConnection();
    this.message = new BehaviorSubject<Message[]>([]);
    this.$messages = this.message.asObservable();
    this.userInfo = new BehaviorSubject<UserInfo>(new UserInfo('', ''));
  }

  private initConnection(): HubConnection {
    return new signalr.HubConnectionBuilder()
      .withUrl(environment.urlBase + "chatgrouphub")
      .build();
  }

  public getUserInfo(): Observable<UserInfo> {
    return this.userInfo.asObservable();
  }

  public getMessage(): Observable<Message[]> {
    return this.$messages;
  }

  public async enterGroup(userInfo: UserInfo): Promise<boolean> {
    this.resetChat();

    if(this.hubConnection.state == signalr.HubConnectionState.Disconnected) {
      return await this.hubConnection.start().then(
        async () => {
          this.userInfo.next(userInfo);
          return await this.hubConnection.invoke<boolean>('EnterGroup', userInfo.groupName, userInfo.userName);
        }
      );
    }

    this.userInfo.next(userInfo);
    return await this.hubConnection.invoke('EnterGroup', userInfo.groupName, userInfo.userName);
  } 

  public receiveMessages(): void {
    this.hubConnection?.on('ReceiveMessages', data => {
      var messages = this.message.value;
      messages.push(data);
      this.message.next(messages);
    });
  }

  public sendMessage(message: Message): void {
    const model: UserInfo = this.userInfo.value;
    if(!model) {
      throw "Erro de argumento";
    }

    this.hubConnection?.invoke('SendMessage', model.groupName, model.userName, message.content, message.type);
  }

  public sendMessagePrivate(message: Message): void {
    const model: UserInfo = this.userInfo.value;
    if(!model) {
      throw "Erro de argumento";
    }

    this.hubConnection?.invoke('SendPrivateMessage', model.userName, message.content, message.type);
  }

  public leaveGroup(): Promise<boolean | undefined> | undefined {
    try {
      const model: UserInfo = this.userInfo.value;

      if(this.hubConnection?.state == signalr.HubConnectionState.Disconnected) {
        return this.hubConnection.start().then(
          () => {
            this.resetChat();
            this.userInfo.next(new UserInfo('', ''));
            return this.hubConnection?.invoke('LeaveGroup', model.groupName, model.userName);
          }
        );
      }

      this.resetChat();
      this.userInfo.next(new UserInfo('', ''));
      return this.hubConnection?.invoke('LeaveGroup', model.groupName, model.userName);
    } catch (error) {
      throw error;
    } finally {
      this.hubConnection?.stop();
    }
  }

  private resetChat(): void {
    if(this.userInfo.value) {
      this.hubConnection?.off('ReceiveMessages')
    }

    this.message.next([]);
  }
}