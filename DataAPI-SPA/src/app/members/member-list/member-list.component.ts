import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html'
})
export class MemberListComponent implements OnInit {

  user: User;
  users: User[];
  totalItems: number;
  pagination: Pagination;
  userParams: any;

  constructor(private userService: UserService, private notifications: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users =  data.users.result;
      this.pagination = data.users.pagination;
      this.user = JSON.parse(localStorage.getItem('user'));
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers(): void{
    this.userService.getUsers(this.pagination.currentPage,
                              this.pagination.itemsPerPage,
                              this.userParams ? this.userParams : null)
              .subscribe((response: PaginatedResult<User[]>) => {
      this.users =  response.result;
      this.pagination = response.pagination;
    }, error => {
      this.notifications.errorDialog(error);
    });
  }

  setUserParams(params: any){
    this.userParams = params;
    this.loadUsers();
  }
}
