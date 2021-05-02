import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable()
export class StripeService {

  constructor(
    private http: HttpClient
  ) { }

  charge(cantidad, tokenId) {
    return this.http.post(environment.STRIPE_URL, {
      stripeToken: tokenId,
      cantidad: cantidad
    }).toPromise();
  }

}
