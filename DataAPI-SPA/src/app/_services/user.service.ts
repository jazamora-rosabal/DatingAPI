import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../_models/user';
import { identifierModuleUrl } from '@angular/compiler';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) {}

  getUsers(page?, itemsPerPage?, userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if ( page != null ) {
      params = params.append('pageNumber', page);
    }
    if ( itemsPerPage != null ) {
      params = params.append('pageSize', itemsPerPage);
    }

    if ( userParams != null ) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
    }
    return this.http.get<User[]>(this.baseUrl, { observe: 'response', params})
                  .pipe(
                    map(response => {
                      paginatedResult.result = response.body;
                      if ( response.headers.get('Pagination') != null ) {
                            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                      }
                      return paginatedResult;
                  }));
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.http.put<void>(this.baseUrl + '/' + id, user);
  }

  setMainPhoto(userId: number, photoId: number): Observable<void> {
    return this.http.post<void>(this.baseUrl + '/' + userId + '/photos/' + photoId + '/setMain', { });
  }
  // http://localhost:5000/api/users/{userId}/photos/{idPhoto}
  deleteFPhoto(userId: number, photoId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + userId + '/photos/' + photoId);
  }
}
