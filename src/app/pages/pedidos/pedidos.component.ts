import { Component, OnInit } from '@angular/core';
import { OrderService } from 'app/services/order.service';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [ProductsService,OrderService]
})
export class PedidosComponent implements OnInit {

  pedidos:any = [];

  constructor(
    private productsService: ProductsService,
    private orderService: OrderService
  ) {
    // let obj = JSON.parse(localStorage.getItem('CognitoIdentityServiceProvider.1eg084qoupgmon8ff7q38iebnb.LastAuthUser'));
    let obj = localStorage.getItem('CognitoIdentityServiceProvider.1eg084qoupgmon8ff7q38iebnb.LastAuthUser');
    if(obj){
      this.getOrdersId(obj);
    }
   
   }

  ngOnInit() {

  }


  async getOrdersId(username){
    this.orderService.getOrders(username).then(orders=>{
      this.pedidos = orders;
    })
  }



  deletePedido(idPedidoMongo){
    console.log(idPedidoMongo);

    this.orderService.cancelOrder(idPedidoMongo).then(
      data =>{
          console.log(data);
      }
    );


    this.pedidos = this.pedidos.filter(function(item) {
        return item._id !== idPedidoMongo
    })


  }

}
