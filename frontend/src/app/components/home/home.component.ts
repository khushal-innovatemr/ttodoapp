import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { TodoAddComponent } from '../todo-add/todo-add.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoAddComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasks: any[] = [];
  edit: boolean = false;
  editTask: any = {};
  
  constructor(
    private todo: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getTasks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getTasks(): void {
    this.todo.get('tasks').subscribe({
      next: (res: any) => {
        this.tasks = res;
      },
      error: (error: any) => {
        console.error('Error Fetching Tasks', error);
      }
    });
  }

  addTask(task: any): void {
    this.todo.post('tasks', task).subscribe({
      next: (res: any) => {
        console.log('Task added:', res);
        this.getTasks();
      },
      error: (error: any) => {
        console.error('Error Adding Task', error);
      }
    });
  }

  handleDelete(task: any): void {
    this.todo.delete('tasks/' + task.id, {}).subscribe({
      next: (res: any) => {
        console.log('Task Deleted:', res);
        this.getTasks();
      },
      error: (error: any) => {
        console.error('Error Deleting Task:', error);
      }
    });
  }

  handleEdit(task: any): void {
    this.edit = true;
    console.log(task);
    this.editTask = task;
    console.log(task);
  }

  handleComplete(task: any): void {
    this.todo.put('tasks/' + task.id, {
      name: task.name,
      description: task.description,
      createdAt: task.createdAt,
      deadline: task.deadline,
      completed: true
    }).subscribe({
      next: (res: any) => {
        console.log('Task Completed:', res);
        this.getTasks();
      },
      error: (error: any) => {
        console.error('Error Completing Task', error);
      }
    });
  }

  handleUpdate(task: any): void {
    console.log(task.name);
    console.log(task);
    this.edit = false;
    this.todo.put('tasks/' + task.id, {
      name: task.name,
      description: task.description,
      deadline: task.deadline,
    }).subscribe({
      next: (res: any) => {
        console.log('Task Updated:', res);
        this.getTasks();
      },
      error: (error: any) => {
        console.error('Error Updating Task:', error);
      }
    });
  }
}