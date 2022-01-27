import { Injectable } from '@angular/core';

import { HubConnection } from '@microsoft/signalr';
import * as signalr from '@microsoft/signalr';

import { environment } from 'src/environments/environment';

import { Message } from 'src/app/models/message';
import { UserInfo } from 'src/app/models/user-info';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class ConversaService {

  private hubConnection: HubConnection;

  private message: BehaviorSubject<Message[]>;
  private $messages: Observable<Message[]>;

  private userInfo: BehaviorSubject<UserInfo>;

  private user: any;

  constructor(
    private loginService: LoginService
  ) {
    this.hubConnection = this.initConnection();
    this.message = new BehaviorSubject<Message[]>([]);
    this.$messages = this.message.asObservable();
    this.userInfo = new BehaviorSubject<UserInfo>(new UserInfo('', ''));
    
    this.loginService.getCurrentUser().subscribe(
      currentUser => {
        this.user = currentUser;
      }
    );
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
  //!
  public setUserConnection(): void {
    this.hubConnection.start();
    // this.hubConnection.start().then(
    //   async () => {
    //     await this.hubConnection.invoke('SetUserConnection').then(data => {
    //       console.log("Conexão: ", data);
    //     });
    //   }
    // );
  }
  //!
  public getNotification(): void {
    this.hubConnection.on('Notify', data => {
      console.warn('Notificação: ', data);
      //! Já avisei que vai dar B.O., 06
      if(data.label == "userId" && !this.user.userId) {
        this.user.userId = data.userId;
        this.loginService.setCurrentUser(this.user);
      }
    });
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
    this.hubConnection.on('ReceiveMessages', data => {
      console.log("Nova mensagem (Evento): ", data);
      var messages = this.message.value;
      messages.push(data);
      this.message.next(messages);
    });
  }

  public sendMessage(messageData: Message & UserInfo): void {
    // const model: UserInfo = this.userInfo.value;
    // if(!model) {
    //   throw "Erro de argumento";
    // }

    this.hubConnection.invoke('SendMessage', messageData.groupName, messageData.userName, messageData.content, messageData.type);
  }

  public receivePrivateMessages(): void {
    this.hubConnection.on('ReceivePrivateMessage', data => {
      console.warn("Mensagem PRIVADA: ", data);
      alert(`${data.userName}: ${data.content}`);
    });
  }

  public sendMessagePrivate(data: any): void {
    // const model: UserInfo = this.userInfo.value;
    // if(!model) {
    //   throw "Erro de argumento";
    // }

    this.hubConnection.invoke('SendPrivateMessage', data.userName, data.toUserId, data.content, data.type);
  }

  public leaveGroup(): Promise<boolean> | undefined {
    try {
      const model: UserInfo = this.userInfo.value;

      if(this.hubConnection.state == signalr.HubConnectionState.Disconnected) {
        return this.hubConnection.start().then(
          () => {
            this.resetChat();
            this.userInfo.next(new UserInfo('', ''));
            return this.hubConnection.invoke('LeaveGroup', model.groupName, model.userName);
          }
        );
      }

      this.resetChat();
      this.userInfo.next(new UserInfo('', ''));
      return this.hubConnection.invoke('LeaveGroup', model.groupName, model.userName);
    } catch (error) {
      throw error;
    } finally {
      this.hubConnection.stop();
    }
  }

  private resetChat(): void {
    if(this.userInfo.value) {
      this.hubConnection.off('ReceiveMessages')
    }

    this.message.next([]);
  }
}