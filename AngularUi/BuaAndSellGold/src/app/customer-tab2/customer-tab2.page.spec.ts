import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTab2Page } from './customer-tab2.page';

describe('CustomerTab2Page', () => {
  let component: CustomerTab2Page;
  let fixture: ComponentFixture<CustomerTab2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
