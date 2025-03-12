import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  email = '';
  password = '';
  role:any = '';
  tasks:any = [];
  edit: boolean = false;
  editTask: any = {};
  views:any = [];
  t:any = '';
  errorMessage = '';
  successMessage = '';
  noTasksMessage = '';
  selectedUserId: string | null = null;
  showTasks = false;
  currentUserId: string = '';
  user: any = [];
  countTask:any;
  comp:boolean = false;
  pend:boolean = false;
  completed_task:any;
  pending_task:any;
  showTodoList: boolean = false;
  showTask:boolean = false;
  id:any;
  


  constructor(private authService: AuthService,private todo:TodoService, private router: Router) {}

  ngOnInit(): void {
    this.getUserEmail();
  }

  @Output() ViewUser:EventEmitter<any> = new EventEmitter();

  getUserEmail(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        this.email = tokenData.email || 'User';
      } catch (error) {
        console.error('Error decoding token:', error);
        this.email = 'User';
      }
    }
  }
  
  completed(): void {
    this.comp = !this.comp;
    if (this.comp) {
      this.authService.completed_count().subscribe({
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



  AddUser(): void {
    this.authService.AddUser(this.email, this.password, this.role).subscribe({
      next: () => {
        this.successMessage = 'User Saved!';
        setTimeout(() => {
          this.successMessage = 'Redirecting to login page...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }, 3000);
      },
      error: (err) => (this.errorMessage = err.error.error)
    });
  }
  flag:boolean=true;

  CheckUser(): void {
    if(this.flag){
      this.flag = !this.flag
      this.authService.getUsers().subscribe({
        next: (res: any) => {
          this.tasks = res;
          this.user =res;
      },
        error: (error: any) => {
          console.error('Error Fetching Users', error);
      }
    });
  }
else{
  this.tasks=[]
  this.flag=!this.flag
}}


SeeUserTasks(userId: string): void {
  console.log(`SeeUserTasks called with userId: ${userId}`);
 
  if (this.showTasks && this.currentUserId === userId) {
    console.log('Toggling off task view');
    this.views = [];
    this.noTasksMessage = '';
    this.showTasks = false;
    this.currentUserId = '';
    return;
  }

  console.log(`Fetching tasks for user: ${userId}`);
  this.authService.viewUserTasks(userId).subscribe({
    next: (res: any) => {
      console.log('Response received:', res);

      if (res.message) {
        console.log('No tasks message:', res.message);
        this.views = [];
        this.noTasksMessage = res.message;
      } else {
        console.log('Tasks received:', res);
        this.views = res;
        this.noTasksMessage = '';
      }

      this.showTasks = true;
      this.currentUserId = userId;
      console.log(`Updated state -> showTasks: ${this.showTasks}, currentUserId: ${this.currentUserId}, views:`, this.views);
    },
    error: (error: any) => {
      console.error('Error fetching tasks:', error);
      this.noTasksMessage = 'Error fetching tasks!';
      this.views = [];
      this.showTasks = true;
      this.currentUserId = userId;
     
      console.log(`Error state -> showTasks: ${this.showTasks}, currentUserId: ${this.currentUserId}`);
    },
  });
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
    this.views = this.views.filter((v:any) => v.id !== task.id);
    this.todo.delete('tasks/' + task.id, {}).subscribe({
      next: (res: any) => {
        console.log('Task Deleted:', res);
      },
      error: (error:any) => {
        console.error('Error Deleting Task:');
      }
    });
  }

  DeleteUser(userId: string): void {
    if (!userId) {
        console.error('No user selected for deletion');
        return;
    }
    console.log('Trying to delete user with ID:', userId);
    this.authService.deleteUsers(userId).subscribe({
        next: () => {
            console.log('User Deleted Successfully:', userId);
            this.tasks = this.tasks.filter((u: any) => u.id !== userId);
            // Reset view if the current viewed user is deleted
            if (this.currentUserId === userId) {
                this.views = [];
                this.showTasks = false;
                this.currentUserId = '';
            }
        },
        error: (error: any) => {
            console.error('Error Deleting User:', error);
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
