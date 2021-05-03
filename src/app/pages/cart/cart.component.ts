import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [ProductsService]
})
export class CartComponent implements OnInit {

  cartProductsTemp:any;
  cartProducts = [];
  total = 0;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {
    this.showProducts();
   }

  ngOnInit() {
  }

  showProducts(){
    this.productsService.getProducts().subscribe(
      (data)=>{
        this.cartProductsTemp = data;
        this.cartProductsTemp.forEach(element => {
          let obj = JSON.parse(localStorage.getItem(element.idProducto));
          if(obj){
            this.cartProducts.push(obj);
            this.total = 0;
            this.total += Number(obj.precio) * Number(obj.cantidad);
          }
        });
      }
    )
  }

  deleteFromCart(idProducto){
    localStorage.removeItem(idProducto);
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }


  goCheckOut(){
    console.log('Go checkout');
    localStorage.setItem('totales', JSON.stringify(this.cartProducts));
    localStorage.setItem('totales_cuenta', JSON.stringify(this.total));
    this.router.navigate(['/checkout']);
  }

}
