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

}
