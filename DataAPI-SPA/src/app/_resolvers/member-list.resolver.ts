import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
/* Resolver encargado de cargar la lista de Usuarios
 Aqui solo se maneja el posible error con Pipe y catchError, y en el routing se debe especificar que ruta resuelve(resolve)
 el subscribe de la llamada se realiza en el componente a traves de ActivatedRoute
*/
export class MemberListResolver implements Resolve<User[]>{
    pageNumber = 1;
    pageSize = 3;

    constructor(private userServices: UserService,
                private router: Router,
                private notification: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]>  {
        return this.userServices.getUsers(this.pageNumber, this.pageSize).pipe(
            catchError(error => {
                this.notification.errorDialog('Problems retrieving Data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}