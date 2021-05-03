import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable()
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  create_user(emailParam) {
    return this.http.post(environment.STRIPE_URL, {
      email: emailParam,
    }).toPromise();
  }

}
