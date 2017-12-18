import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from './order.component';
import {Component, DebugElement} from '@angular/core';
import {Category} from '../model/category';
import {Set, Map} from 'immutable';
import {MatCardModule, MatIconModule, MatListModule} from '@angular/material';
import {PricePipe} from '../price.pipe';
import {By} from '@angular/platform-browser';
import {Util} from '../common/Util';
import {Item} from '../model/item';
import {Catalog} from '../model/catalog';
import {OrderTotalComponent} from './total/order-total.component';

@Component({
  template: `
    <mt-order [catalog]=catalog [order]=order (itemRemoved)="itemRemoved($event)"></mt-order>
    `
})
class TestHostComponent {
  catalog: Catalog;
  order: Map<string, Set<string>>;
  selectedItem: string;
  itemRemoved(itemId: string) { this.selectedItem = itemId; }
}

function verifyOrder(itemList: DebugElement[], order: Map<string, Set<string>>, catalog: Catalog) {
  const expectedCategories = Util.getCategoriesForOrder(order, catalog);
  expect(itemList.length).toEqual(expectedCategories.length);

  expectedCategories.forEach((expectedCategory: Category, index) => {
    const category = itemList[index];

    const categoryId = category.nativeElement.attributes['data-category-id'].textContent;
    expect(categoryId).toEqual(expectedCategory.id);
    const categoryName = category.query(By.css('.order-category-name'));
    expect(categoryName.nativeElement.textContent).toEqual(expectedCategory.name);

    const expectedCategoryItems = Util.getOrderCategoryItems(order, catalog, categoryId);
    const categoryItems = category.queryAll(By.css('.order-item'));
    expect(categoryItems.length).toEqual(expectedCategoryItems.length);
    expectedCategoryItems.forEach((categoryItem: Item, itemIndex) => {
      const item = categoryItems[itemIndex];
      const itemId = item.nativeElement.attributes['data-item-id'].textContent;
      expect(itemId).toEqual(categoryItem.id);
      expect(item.nativeElement.textContent).toContain(categoryItem.name);
    });
  });
}

describe('OrderComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const catalog = <Catalog>{ entries: Map({
    category2: {
      id: 'category2',
      name: 'category 2',
      icon: 'category2',
      items: {
        item21: {
          id: 'item21',
          category: 'category2',
          name: 'Item 21',
          commercialSource: 'Item 21 Source',
          value: 1234
        },
        item22: {
          id: 'item22',
          category: 'category2',
          name: 'Item 22',
          commercialSource: 'Item 22 Source',
          value: 4567
        }
      }
    },
    category1: {
      id: 'category1',
      name: 'category 1',
      icon: 'category1',
      items: {
        item11: {
          id: 'item11',
          category: 'category1',
          name: 'Item 11',
          commercialSource: 'Item 11 Source',
          value: 1234
        },
        item12: {
          id: 'item12',
          category: 'category1',
          name: 'Item 12',
          commercialSource: 'Item 12 Source',
          value: 4567
        }
      }
    }
  })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderComponent, OrderTotalComponent, TestHostComponent, PricePipe ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have no items without input', () => {
    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), null, catalog);
  });

  it('should have one item', () => {
    const order = Map({
      category1: Set(['item11'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), order, catalog);
  });

  it('should have one item from each category', () => {
    const order = Map({
      category1: Set(['item11']),
      category2: Set(['item22'])
    });

    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), order, catalog);
  });

  it('should not fail for invalid category', () => {
    const order = Map({
      foo1: Set(['item11'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), order, catalog);
  });

  it('should not fail for invalid item id', () => {
    const order = Map({
      category1: Set(['itemXX'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), order, catalog);
  });

  it('should send item removed event', () => {
    const order = Map({
      category1: Set(['item11'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyOrder(fixture.debugElement.queryAll(By.css('.order-category')), order, catalog);

    const removeButton = fixture.debugElement.query(By.css('.item-remove'));
    expect(removeButton).toBeTruthy();
    removeButton.triggerEventHandler('click', 0);
    expect(component.selectedItem).toEqual({ categoryId: 'category1', itemId: 'item11' });
  });
});
