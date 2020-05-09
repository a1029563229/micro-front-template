import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'micro-app-angular';

  menus = [
    {
      key: "angular",
      route: "/",
      title: "主页"
    },
    {
      key: "angular-list",
      route: "/list",
      title: "列表页"
    }
  ]

  get currentRoute() {
    const menu = this.menus.find(item => item.route === window.location.pathname)
    return menu ? menu.key : "angular";
  }
}
