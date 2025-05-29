import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerTab1Page } from './customer-tab1.page';

describe('CustomerTab1Page', () => {
  let component: CustomerTab1Page;
  let fixture: ComponentFixture<CustomerTab1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
