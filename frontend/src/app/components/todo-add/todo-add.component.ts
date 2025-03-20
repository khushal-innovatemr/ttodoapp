import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.css'
})
export class TodoAddComponent implements OnInit {
  constructor(private todo: TodoService) {}

  name: string = '';
  description: string = '';
  deadline: any;
  createdAt: any;
  disable: boolean = true;

  @Output() todoAdd: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}

  handleChange() {
    this.disable = !(this.name.trim().length > 0 && this.description.trim().length > 0);
  }

  handleSubmit() {
    this.todoAdd.emit({
      name: this.name,
      description: this.description,
      deadline: this.deadline,
      createdAt: this.createdAt,
    });
    this.resetForm();
  }

  resetForm() {
    this.name = '';
    this.description = '';
    this.deadline = null;
    this.createdAt = null;
    this.disable = true;
  }
} 