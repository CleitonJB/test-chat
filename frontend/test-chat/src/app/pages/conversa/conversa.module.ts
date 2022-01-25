import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { ConversaComponent } from './conversa.component';

const routes: Routes = [
  {
    path: '',
    component: ConversaComponent
  }
];

@NgModule({
  declarations: [
    ConversaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class ConversaModule { }
