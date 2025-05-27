import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTab3Page } from './customer-tab3.page';

describe('CustomerTab3Page', () => {
  let component: CustomerTab3Page;
  let fixture: ComponentFixture<CustomerTab3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
