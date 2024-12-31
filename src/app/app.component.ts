import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CheatsheetComponent } from './component/cheatsheet/cheatsheet.component';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';

declare global {
  interface Window {
    documentPictureInPicture?: any;
  }
}

@Component({
  selector: 'pip-cheatsheet',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CheatsheetComponent, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'pip-cheatsheet';
  @ViewChild('pipViewer') pipViewer: ElementRef;

  public async onPipViewClick(): Promise<void> {
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 600,
      height: 400,
    });
    Array.from(document.styleSheets).forEach((styleSheet) => {
      try {
        const cssRules = Array.from(styleSheet.cssRules)
          .map((rule) => rule.cssText)
          .join('');
        const style = document.createElement('style');

        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        // link.media = styleSheet.media;
        // link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });
    pipWindow.document.body.append(this.pipViewer.nativeElement);
  }
}
