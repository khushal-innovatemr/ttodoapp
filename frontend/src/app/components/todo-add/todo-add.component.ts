import { Component, OnInit, Output, output } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { EventEmitter} from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.css'
})
export class TodoAddComponent implements OnInit {
  task:any;
  constructor(private todo:TodoService){}
  
  ngOnInit(): void {
    this.handleChange();
  }

  name:string = 'sample';
  description:string = 'sample';
  deadline:any
  createdAt:any
  disable:boolean = true;



  @Output() todoAdd:EventEmitter<any> = new EventEmitter();

  handleChange(){
    if(this.name.length>0 && this.description.length >0){
      this.disable = false;
    }
    else{
      this.disable = true;
    }
  }

  handleSubmit(){

    this.todoAdd.emit({
      name:this.name,
      description:this.description,
      deadline:this.deadline,
      createdAt:this.createdAt,
    } as any)
    this.handleChange();
  }

}
