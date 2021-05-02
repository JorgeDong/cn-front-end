import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAuthComponent } from './products-auth.component';

describe('ProductsAuthComponent', () => {
  let component: ProductsAuthComponent;
  let fixture: ComponentFixture<ProductsAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
