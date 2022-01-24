import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private menuService: MenuService
  ) { 
    this.groups = [];
  }

  ngOnInit(): void {
    this.getGroups();
  }

  private getGroups(): void {
    this.groups = this.menuService.getGroups();
  }

  public navigateToConversa(groupId: string): void {
    this.router.navigate(['conversa', groupId]);
  }
}
