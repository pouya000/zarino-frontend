import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddSellerComponent } from './add-seller.component';

describe('AddSellerComponent', () => {
  let component: AddSellerComponent;
  let fixture: ComponentFixture<AddSellerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddSellerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
