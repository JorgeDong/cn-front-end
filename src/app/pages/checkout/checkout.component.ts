import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [StripeService]
})
export class CheckoutComponent implements OnInit,AfterViewInit {

  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardError: string;
  card: any;

  constructor(
    private ngZone: NgZone,
    private stripeService: StripeService
  ){}

  ngAfterViewInit(){
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.onChange.bind(this));
  }

// Del objeto event se destruye y solo nos quedamos con el error
  onChange({ error }) {
    if(error){
      this.ngZone.run(()=>{
        this.cardError = error.message;
      });
    }else {
      this.ngZone.run(()=>{
        this.cardError = null;
      });
     
    }
  }

  //tarjeta de prueba 42424242424242424
  async onClick(){
    const { token, error } = await stripe.createToken(this.card);
    if(token){
      const response = await this.stripeService.charge(100,token.id);
      console.log(response);
    }else{
      this.ngZone.run(()=>{
        this.cardError = error.message;
      });
    }
  }



  ngOnInit(){

  }

  
  // elements: Elements;
  // card: StripeElement;
  // elementsOptions: ElementsOptions = {
  //   locale: 'es'
  // };

  // stripeTest: FormGroup;

  // constructor(private fb: FormBuilder, private stripeSvc: StripeService) {}

  // ngOnInit() {
  //   this.stripeTest = this.fb.group({
  //     name: ['', Validators.required]
  //   });

  //   this.stripeSvc.elements(this.elementsOptions).subscribe(elements => {
  //     this.elements = elements;
  //     if (!this.card) {
  //       this.card = this.elements.create('card', {
  //         style: {
  //           base: {
  //             iconColor: '#666ee8',
  //             color: '#31325f',
  //             lineHeight: '40px',
  //             fontWeight: 300,
  //             fontSize: '20px'
  //           }
  //         }
  //       });
  //       this.card.mount('#card-element');
  //     }
  //   });
  // }

  // buy() {
  //   const name = this.stripeTest.get('name').value;
  //   this.stripeSvc.createToken(this.card, { name }).subscribe(result => {
  //     if (result.token) {
  //       console.log('Token', result.token);
  //     } else if (result.error) {
  //       console.log('Error', result.error.message);
  //     }
  //   });
  // }
}