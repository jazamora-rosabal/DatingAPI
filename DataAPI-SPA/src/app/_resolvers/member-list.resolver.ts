import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class MemberListResolver implements Resolve<User[]>{

    constructor(private userServices: UserService,
                private router: Router,
                private notification: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]>  {
        return this.userServices.getUsers().pipe(
            catchError(error => {
                this.notification.errorDialog('Problems retrieving Data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}