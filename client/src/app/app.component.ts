import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { pageChangeAnimation } from './animations/page-change';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [pageChangeAnimation]
})
export class AppComponent {
  title = 'LoginModule';

  prepareRoute(outlet: RouterOutlet) {
    const dataStr = 'animation';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[dataStr];
  }
}
