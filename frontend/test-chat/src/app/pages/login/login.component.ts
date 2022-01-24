import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.setInitialForm();
  }

  private setInitialForm(): void {
    this.loginForm = new FormGroup({
      nome:  new FormControl(null),
      senha: new FormControl(null)
    });
  }

  public onSubmit(): void {
    const userData: any = this.loginForm.value;
    this.loginService.setCurrentUser(userData);

    this.navigateToMenu();
  }

  private navigateToMenu() {
    this.router.navigate(['menu']);
  }
}
