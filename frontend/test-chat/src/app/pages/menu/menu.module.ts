import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { MenuComponent } from './menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent
  }
];

@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class MenuModule { }
