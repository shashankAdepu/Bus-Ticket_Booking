import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  getToken() {
    return localStorage.getItem('token')
  }

  getUserId() {
    return this.getTokenPayload()['id']
  }

  getName() {
    return this.getTokenPayload()['name']
  }

  info():Observable<any>{
    return this.http.get('http://localhost:3000/api/users');
  }

  getTokenPayload() {
    if(localStorage.getItem('token')) {
      let payload = localStorage.getItem('token')?.split('.')[1];
      let decoded = this.b64DecodeUnicode(payload);
      let parsed = JSON.parse(decoded);
      return parsed;
    } else {
      return false;
    }
  }

  b64DecodeUnicode(str: any) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
