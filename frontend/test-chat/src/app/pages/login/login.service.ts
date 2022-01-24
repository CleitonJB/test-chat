import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private $currentUser: BehaviorSubject<any>;

  constructor() {
    this.$currentUser = new BehaviorSubject<any>(null);
  }

  public setCurrentUser(userData: any): void {
    this.$currentUser.next(userData);
  }

  public getCurrentUser(): BehaviorSubject<any> {
    return this.$currentUser;
  }
}
