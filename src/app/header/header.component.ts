import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers:[DashboardComponent]
})
export class HeaderComponent implements OnInit {

  user: string;
  constructor(private myAwesomeService: UserService, private dashboard: DashboardComponent ) {

      this.user = this.dashboard.username;
  }

  ngOnInit() {
  }

  logoutUser() {
    this.dashboard.logout();
  }

}
