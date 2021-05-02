import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  constructor(
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    this.showProducts();
  }

  showProducts(){
    this.productsService.getProducts().subscribe(
      (data)=>{
        console.log(data);
      }
    )
  }

}
