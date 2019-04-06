/* tslint:disable:no-duplicate-string */
import {async, ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";

import { OrderComponent } from "./order.component";
import {Component, DebugElement} from "@angular/core";
import {Category} from "../model/category";
import {Set, Map} from "immutable";
import {MatCardModule, MatIconModule, MatListModule} from "@angular/material";
import {PricePipe} from "../price.pipe";
import {By} from "@angular/platform-browser";
import {Util} from "../common/Util";
import {Item} from "../model/item";
import {Catalog} from "../model/catalog";
import {OrderService} from "../service/order-service";

@Component({
  template: `
    <mt-order [catalog]=catalog></mt-order>
    `
})
class TestHostComponent {
  catalog: Catalog;
  order: Map<string, Set<string>>;
}

function verifyOrder(itemList: DebugElement[], order: Map<string, Set<string>>, catalog: Catalog) {
  const expectedCategories = Util.getCategoriesForOrder(order, catalog);
  expect(itemList.length).toEqual(expectedCategories.length);

  expectedCategories.forEach((expectedCategory: Category, index) => {
    const category = itemList[index];

    const categoryId = category.nativeElement.attributes["data-category-id"].textContent;
    expect(categoryId).toEqual(expectedCategory.id);
    const categoryName = category.query(By.css(".order-category-name"));
    expect(categoryName.nativeElement.textContent).toEqual(expectedCategory.name);

    const expectedCategoryItems = Util.getOrderCategoryItems(order, catalog, categoryId);
    const categoryItems = category.queryAll(By.css(".order-item"));
    expect(categoryItems.length).toEqual(expectedCategoryItems.length);
    expectedCategoryItems.forEach((categoryItem: Item, itemIndex) => {
      const item = categoryItems[itemIndex];
      const itemId = item.nativeElement.attributes["data-item-id"].textContent;
      expect(itemId).toEqual(categoryItem.id);
      expect(item.nativeElement.textContent).toContain(categoryItem.name);
    });
  });
}

function verifyTotal(total: DebugElement, expectedTotal: number) {
  expect(total.nativeElement.textContent).toEqual(Util.formatPrice(expectedTotal));
}

function verifyOrderObject(expectedOrder: Map<string, Set<string>>, actualOrder: Map<string, Set<string>>) {
  expect(expectedOrder).toBeTruthy();
  expect(actualOrder).toBeTruthy();
  expectedOrder.keySeq().toArray().forEach(value => {
    expect(actualOrder.has(value)).toBeTruthy();
    const expectedItems = expectedOrder.get(value);
    const actualItems = actualOrder.get(value);
    expect(expectedItems.size).toEqual(actualItems.size);
    expectedItems.toArray().forEach(item => {
      expect(actualItems.contains(item)).toBeTruthy();
    });
  });
}

/* tslint:disable-next-line:no-big-function */
describe("OrderComponent", () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let orderService: OrderService;

  const catalog: Catalog = { entries: Map({
    category2: {
      id: "category2",
      name: "category 2",
      icon: "category2",
      items: {
        item21: {
          id: "item21",
          category: "category2",
          name: "Item 21",
          commercialSource: "Item 21 Source",
          value: 1234
        },
        item22: {
          id: "item22",
          category: "category2",
          name: "Item 22",
          commercialSource: "Item 22 Source",
          value: 4567
        }
      }
    },
    category1: {
      id: "category1",
      name: "category 1",
      icon: "category1",
      items: {
        item11: {
          id: "item11",
          category: "category1",
          name: "Item 11",
          commercialSource: "Item 11 Source",
          value: 1234
        },
        item12: {
          id: "item12",
          category: "category1",
          name: "Item 12",
          commercialSource: "Item 12 Source",
          value: 4567
        }
      }
    }
  })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderComponent, TestHostComponent, PricePipe ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ],
      providers: [ OrderService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    orderService = TestBed.get(OrderService);
    orderService.clearOrder();
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should have no items without input", () => {
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), null, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(null, catalog));
  });

  it("should have one item", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["item11"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "category1");
    tick();
    fixture.detectChanges();
    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));
  }));

  it("should have one item from each category", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["item11"]),
      category2: Set(["item22"])
    });

    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));
  }));

  it("should not fail for invalid category", fakeAsync(() => {
    const expectedOrder = Map({
      foo1: Set(["item11"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "foo1");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));
  }));

  /* tslint:disable-next-line:no-identical-functions */
  it("should not fail for invalid item id", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["itemXX"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("itemXX", "category1");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));
  }));

  it("should remove the only item", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["item11"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "category1");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));

    const removeButton = fixture.debugElement.query(By.css(".item-remove"));
    expect(removeButton).toBeTruthy();
    removeButton.triggerEventHandler("click", 0);
    tick();
    fixture.detectChanges();

    const emptyOrder: Map<string, Set<string>> = Map();
    verifyOrderObject(emptyOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), emptyOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(emptyOrder, catalog));
  }));

  it("should remove the only item from a category and that category", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["item11"]),
      category2: Set(["item22"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));

    const removeButton = fixture.debugElement.query(By.css(".item-remove"));
    expect(removeButton).toBeTruthy();
    removeButton.triggerEventHandler("click", 0);
    tick();
    fixture.detectChanges();

    const updatedOrder = Map({
      category2: Set(["item22"])
    });
    verifyOrderObject(updatedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), updatedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(updatedOrder, catalog));
  }));

  it("should remove a single item from a category", fakeAsync(() => {
    const expectedOrder = Map({
      category1: Set(["item11", "item12"])
    });
    component.catalog = catalog;
    fixture.detectChanges();
    orderService.addItem("item11", "category1");
    orderService.addItem("item12", "category1");
    tick();
    fixture.detectChanges();

    verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));

    const removeButton = fixture.debugElement.query(By.css(".item-remove"));
    expect(removeButton).toBeTruthy();
    removeButton.triggerEventHandler("click", 0);
    tick();
    fixture.detectChanges();

    const updatedOrder = Map({
      category1: Set(["item12"])
    });
    verifyOrderObject(updatedOrder, orderService.getCurrentOrder());
    verifyOrder(fixture.debugElement.queryAll(By.css(".order-category")), updatedOrder, catalog);
    verifyTotal(fixture.debugElement.query(By.css(".order-total")), Util.getOrderTotal(updatedOrder, catalog));
  }));
});
