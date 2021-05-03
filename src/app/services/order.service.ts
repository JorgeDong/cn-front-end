import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable()
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }


  createOrder(objParam){
    return this.http.post(environment.API_ORDERS + `create`,objParam).toPromise();
  }

  getOrders(username){
    return this.http.get(environment.API_ORDERS + `username/${username}`).toPromise();
  }

  getOrder(){

  }

  cancelOrder(idPedidoMongo){
    return this.http.delete(environment.API_ORDERS + `delete/${idPedidoMongo}`).toPromise();
  }





}
