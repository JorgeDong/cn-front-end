import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';
import { AuthService } from '../../user/auth.service';
@Component({
  selector: 'app-products-auth',
  templateUrl: './products-auth.component.html',
  styleUrls: ['./products-auth.component.css'],
  providers: [ProductsService]
})
export class ProductsAuthComponent implements OnInit {

  username;
  cartId;
  data:any;
  cantidadProductos = 1;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.showProducts();
    //Obtener usuario
    this.username = this.authService.getAuthenticatedUser().getUsername();
    //Crear carrito


  }


  showProducts(){
    this.productsService.getProducts().subscribe(
      (data)=>{
        console.log(data);
        this.data = data;
      }
    )
  }

  // addCart(idProducto){
  //   console.log('Insertando');
  //   console.log(this.authService.getAuthenticatedUser().getUsername());
  //   console.log(idProducto);
  //   this.productsService.cart.push(1);
  //   // Añadir al carrito

    
  // }

  addCart(idProductoParam,nombreParam,precioParam,imgUrlParam){

    let obj = JSON.parse(localStorage.getItem(idProductoParam));
    if(obj){
      localStorage.removeItem(idProductoParam);
    }

    let producto = {
      idProducto: idProductoParam,
      nombre:nombreParam,
      precio: precioParam,
      cantidad: this.cantidadProductos,
      imgUrl: imgUrlParam
    };

    this.cantidadProductos = 1;
    localStorage.setItem(idProductoParam, JSON.stringify(producto));

  }

}
