/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Map} from 'immutable';
import { By } from '@angular/platform-browser';
import {Component, DebugElement} from '@angular/core';

import { CatalogComponent } from './catalog.component';
import {MdCardModule, MdIconModule} from '@angular/material';
import {Category} from '../model/category';

@Component({
  template: `
    <mt-catalog [catalog]=catalog [selectedCategory]=selectedCategory (categorySelected)="categorySelected($event)"></mt-catalog>`
})
class TestHostComponent {
  catalog: Map<string, Category>;
  selectedCategory: string;
  categorySelected(categoryId: string) { this.selectedCategory = categoryId; }
}

function verifyCategoryItems(fixture: ComponentFixture<TestHostComponent>, catalog: Map<string, Category>) {
  const categoryButtons = fixture.debugElement.queryAll(By.css('.catalog-entry'));
  expect(categoryButtons.length).toEqual(catalog.valueSeq().size);
  categoryButtons.forEach((button: DebugElement, index: number) => {
    expect(button.nativeElement.textContent).toContain(`category ${index + 1}`);
  });
}

function verifySelectedCategory(fixture: ComponentFixture<TestHostComponent>, expectedCategoryName: string) {
  const selectedCategoryButton = fixture.debugElement.query(By.css('.selected'));
  expect(selectedCategoryButton).toBeTruthy();
  expect(selectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
}

function verifyAndGetUnselectedCategory(fixture: ComponentFixture<TestHostComponent>, expectedCategoryName: string) {
  const unSelectedCategoryButton = fixture.debugElement.query(By.css('button:not(.selected)'));
  expect(unSelectedCategoryButton).toBeTruthy();
  expect(unSelectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
  return unSelectedCategoryButton;
}

describe('CatalogComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  let category1: Category;
  let category2: Category;
  let catalog: Map<string, Category>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogComponent, TestHostComponent ],
      imports: [
        MdCardModule,
        MdIconModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    category1 = {
      id: 'category1',
      name: 'category 1',
      icon: 'category1',
      items: {}
    };
    category2 = {
      id: 'category2',
      name: 'category 2',
      icon: 'category2',
      items: {}
    };
    catalog = Map({
      foo2: category2,
      foo1: category1
    });

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no categories without input', () => {
    const categoryButtons = fixture.debugElement.queryAll(By.css('.catalog-entry'));
    expect(categoryButtons.length).toEqual(0);
  });

  it('should set the catalog with no selected category', () => {
    component.catalog = catalog;
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    const selectedCategoryButton = fixture.debugElement.query(By.css('.selected'));
    expect(selectedCategoryButton).not.toBeTruthy();
  });

  it('should set the catalog with selected category', () => {
    component.catalog = catalog;
    component.selectedCategory = 'category1';
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    verifySelectedCategory(fixture, 'category 1');
  });

  it('should set selected category', async(() => {
    component.catalog = catalog;
    component.selectedCategory = 'category1';
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    const unSelectedCategoryButton = verifyAndGetUnselectedCategory(fixture, 'category 2');
    unSelectedCategoryButton.triggerEventHandler('click', 0);
    expect(component.selectedCategory).toEqual('category2');
    fixture.detectChanges();
    verifySelectedCategory(fixture, 'category 2');
  }));
});
