import { Component, OnInit } from '@angular/core';

import { LoginService } from './pages/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test-chat';
  public user: any;

  constructor(
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
      this.loginService.getCurrentUser().subscribe(
        (userData: any) => {
          this.user = userData;
          console.log(userData);
        }
      );
  }
}
