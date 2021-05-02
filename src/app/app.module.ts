import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule  } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './user/signup/signup.component';
import { SigninComponent } from './user/signin/signin.component';
import { CompareComponent } from './compare/compare.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './user/auth.service';
import { CompareService } from './compare/compare.service';
import { CompareInputComponent } from './compare/compare-input/compare-input.component';
import { CompareResultsComponent } from './compare/compare-results/compare-results.component';
import { ProductsComponent } from './pages/products/products.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { ProductsAuthComponent } from './pages/products-auth/products-auth.component';

// Import the library
// import { NgxStripeModule } from 'ngx-stripe';
// import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    CompareComponent,
    CompareInputComponent,
    CompareResultsComponent,
    ProductsComponent,
    NavbarComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent,
    PedidosComponent,
    ProductsAuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule
    // ReactiveFormsModule,
    // NgxStripeModule.forRoot('pk_test_51I3VzvLLZMA2tr0ydd90pSE3F9SDehYJjyJO6s0ZuUWxtkFyCFDWAB46fTCsOhLKPJVVNuN6jHQ6yRyQql9ijRlX009TFvnbQm')
  ],
  providers: [AuthService, CompareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
