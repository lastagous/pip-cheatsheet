import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CheatsheetComponent } from './component/cheatsheet/cheatsheet.component';

@Component({
  selector: 'pip-cheatsheet',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CheatsheetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'pip-cheatsheet';
}
