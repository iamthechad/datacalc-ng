import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTotalComponent } from './order-total.component';
import {Component, DebugElement} from '@angular/core';
import {Set, Map} from 'immutable';
import {MatCardModule, MatIconModule, MatListModule} from '@angular/material';
import {PricePipe} from '../../price.pipe';
import {By} from '@angular/platform-browser';
import {Util} from '../../common/Util';
import {Catalog} from '../../model/catalog';

@Component({
  template: `
    <mt-order-total [catalog]=catalog [order]=order></mt-order-total>
    `
})
class TestHostComponent {
  catalog: Catalog;
  order: Map<string, Set<string>>;
}

function verifyTotal(total: DebugElement, expectedTotal: number) {
  expect(total.nativeElement.textContent).toEqual(Util.formatPrice(expectedTotal));
}

describe('OrderTotalComponent', () => {
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
      declarations: [ OrderTotalComponent, TestHostComponent, PricePipe ],
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

  it('should have zero total without input', () => {
    verifyTotal(fixture.debugElement.query(By.css('.order-total')), Util.getOrderTotal(null, catalog));
  });

  it('should have total from one item', () => {
    const order = Map({
      category1: Set(['item11'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyTotal(fixture.debugElement.query(By.css('.order-total')), Util.getOrderTotal(order, catalog));
  });

  it('should have total from one item in each category', () => {
    const order = Map({
      category1: Set(['item11']),
      category2: Set(['item22'])
    });

    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyTotal(fixture.debugElement.query(By.css('.order-total')), Util.getOrderTotal(order, catalog));
  });

  it('should have zero total for invalid category', () => {
    const order = Map({
      foo1: Set(['item11'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyTotal(fixture.debugElement.query(By.css('.order-total')), Util.getOrderTotal(order, catalog));
  });

  it('should have zero total for invalid item id', () => {
    const order = Map({
      category1: Set(['itemXX'])
    });
    component.catalog = catalog;
    component.order = order;
    fixture.detectChanges();

    verifyTotal(fixture.debugElement.query(By.css('.order-total')), Util.getOrderTotal(order, catalog));
  });
});
