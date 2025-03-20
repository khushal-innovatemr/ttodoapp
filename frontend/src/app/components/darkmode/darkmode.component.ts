import { Component } from '@angular/core';
import { DarkModeService } from 'angular-dark-mode';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-darkmode',
  template: `<label class="switch">
               <input type="checkbox" [checked]="darkMode$ | async" (change)="onToggle()">
               <span class="slider round"></span>
             </label>`,
  styleUrls: ['./darkmode.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class DarkModeToggleComponent {
  darkMode$: Observable<boolean> = this.darkModeService.darkMode$;

  constructor(private darkModeService: DarkModeService) {}

  onToggle(): void {
    this.darkModeService.toggle();
  }
}