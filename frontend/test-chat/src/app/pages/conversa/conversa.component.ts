import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-conversa',
  templateUrl: './conversa.component.html',
  styleUrls: ['./conversa.component.scss']
})
export class ConversaComponent implements OnInit {

  public conversaForm: FormGroup;
  private grupo: any;

  public messages: any[];

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.conversaForm = new FormGroup({});
    this.messages = [];
  }

  ngOnInit(): void {
    this.setInitialForm();
    this.setGroupAtInit();
    this.getMessages();
  }

  private setInitialForm(): void {
    this.conversaForm = new FormGroup({
      usuario:   new FormControl(null),
      grupoNome: new FormControl(null),
      mensagem:  new FormControl(null),
    });
  }

  private async getCurrentGroup(): Promise<any> {
    const groupId: string = this.route.snapshot.params['id'];
    const group = this.menuService.getGroups().find(group => groupId === group.id);
    
    return group;
  }

  private setGroupAtInit(): void {
    this.getCurrentGroup().then(group => { 
      this.grupo = group;
  
      this.conversaForm.controls['grupoNome'].setValue(this.grupo.name);

      console.log(this.conversaForm.value);
     });
  }

  private getMessages(): void {
    this.messages = [];
  }

  public onSubmit(): void {

  }
}
