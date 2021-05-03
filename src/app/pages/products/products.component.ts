import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';
import { AuthService } from '../../user/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ProductsService]
})
export class ProductsComponent implements OnInit {
  isAuthenticated = false;
  data:any;
  cantidadProductos = 1;

  constructor(
    private productsService: ProductsService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    console.log(this.authService);


    // this.authService.authStatusChanged.subscribe(
    //   (authenticated) => {
    //     console.log('Authe');
    //     this.isAuthenticated = authenticated;
    //     console.log(this.isAuthenticated);
    //     // if (authenticated) {
    //     //   this.router.navigate(['/compare']);
    //     // } else {
    //     //   this.router.navigate(['/']);
    //     // }
    //   }
    // );
    // this.authService.initAuth();
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

  // localS(){

  //   console.log('LcoalS');
  //   let mi_objeto = {
  //     hola: 'casfasf'
  //   }

  //   localStorage.setItem("usuario", JSON.stringify(mi_objeto));

  //   console.log('Obtener de lo insertado');

  //   let obj = JSON.parse(localStorage.getItem("usuario"));
  //   console.log(obj);

  //   // localStorage.removeItem("titulo");




  //   let producto = {
  //     idProducto: 2,
  //     nombre:"Computadora Gamer Xtreme PC",
  //     precio: 8999,
  //     cantidad: 3,
  //     imgUrl: "https://www.cyberpuerta.mx/img/product/M/CP-XTREMEPCGAMING-XTBRR38GBVEGA3-1.png"
  //   };
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

    localStorage.setItem(idProductoParam, JSON.stringify(producto));

  }


}
