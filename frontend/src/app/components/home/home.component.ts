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
  name = '';
  role = '';
  tasks: any[] = [];
  edit: boolean = false;
  editTask: any = {};
  countTask:any;
  deadline:any;
  completed_task:any;
  pending_task:any;
  email: any = '';
  showTodoList: boolean = false;
  showForm:boolean = false;
  showTask:boolean = false;
  id:any;
  mails: any;
  
  constructor(
    private todo: TodoService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getTasks();
      this.getUserEmail();
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  taskcount(): void {
    this.showTask = !this.showTask;
    if (this.showTask) {
      this.authService.get_count().subscribe({
        next: (res: any) => {
          this.countTask = res;
          console.log(res);
        },
        error: (error: any) => {
          console.error('Error Fetching Tasks', error);
        }
      });
    }
  }

  completed(): void {
    this.showTask = !this.showTask;
    if (this.showTask) {
      this.authService.get_count().subscribe({
        next: (res: any) => {
          this.completed_task = res;
          console.log(res);
        },
        error: (error: any) => {
          console.error('Error Fetching Tasks', error);
        }
      });
    }
  }

  pending(): void {
    this.showTask = !this.showTask;
    if (this.showTask) {
      this.authService.get_count().subscribe({
        next: (res: any) => {
          this.pending_task = res;
          console.log(res);
        },
        error: (error: any) => {
          console.error('Error Fetching Tasks', error);
        }
      });
    }
  }

  getUserEmail(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        this.name = tokenData.name || 'User';
        this.role = tokenData.role || 'user';
      } catch (error) {
        console.error('Error decoding token:', error);
        this.name = 'User';
      }
    }
  }

  getTasks(): void {
    this.todo.get('tasks').subscribe({
      next: (res: any) => {
        this.tasks = res;
        console.log(res);
      },
      error: (error: any) => {
        console.error('Error Fetching Tasks', error);
      }
    });
  }

  addTask(task: any): void {
    this.todo.post('tasks', task).subscribe({
      next:(res: any) => {
        console.log('Task added:', res);
        this.getTasks();
      },
      error:(error: any) => {
        console.error('Error Adding Task', error);
      }
  });
  }

  handleDelete(task: any): void {
    this.todo.delete('tasks/' + task.id, {}).subscribe({
      next:(res: any) => {
        console.log('Task Deleted:', res);
        this.getTasks();
      },
      error:(error: any) => {
        console.error('Error Deleting Task:', error);
      }
  });
  }

  handleEdit(task: any): void {
    this.edit = true;
    this.editTask = task;
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

  toggleTodoList(): void {
    this.showTodoList = !this.showTodoList;
  }

  toggleform():void {
    this.showForm = !this.showForm;
  }



  logout(): void {
    this.authService.logout();
  }
}