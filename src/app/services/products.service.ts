import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable()
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  getProducts() {
    return this.http.get(environment.API_PRODUCTS + `all` );
    // return this.http.get(environment.API_PRODUCTS + `get_products` );
  }

  

}
