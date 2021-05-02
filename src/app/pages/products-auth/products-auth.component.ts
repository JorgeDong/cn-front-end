import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-products-auth',
  templateUrl: './products-auth.component.html',
  styleUrls: ['./products-auth.component.css'],
  providers: [ProductsService]
})
export class ProductsAuthComponent implements OnInit {

  data:any;

  constructor(
    private productsService: ProductsService,
  ) { }

  ngOnInit() {
    this.showProducts();
  }


  showProducts(){
    this.productsService.getProducts().subscribe(
      (data)=>{
        console.log(data);
        this.data = data;
      }
    )
  }

}
