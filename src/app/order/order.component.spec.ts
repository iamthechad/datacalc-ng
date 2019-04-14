import {async, ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";

import { OrderComponent } from "./order.component";
import {DebugElement} from "@angular/core";
import {Category} from "../model/category";
import {MatCardModule, MatIconModule, MatListModule} from "@angular/material";
import {PricePipe} from "../pipe/price.pipe";
import {By} from "@angular/platform-browser";
import {Util} from "../common/util";
import {Item} from "../model/item";
import {Catalog} from "../model/catalog";
import {OrderService} from "../service/order-service";
import {CatalogService} from "../service/catalog-service";
import {CatalogLoaderToken} from "../model/catalog-loader";
import {TestCatalogLoaderService} from "../test/service/test-catalog-loader.service";
import {Order} from "../model/order";

function verifyOrder(itemList: DebugElement[], order: Order, catalog: Catalog) {
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

function verifyOrderAndTotal(debugElement: DebugElement, expectedOrder: Order, catalog: Catalog) {
  verifyOrder(debugElement.queryAll(By.css(".order-category")), expectedOrder, catalog);
  verifyTotal(debugElement.query(By.css(".order-total")), Util.getOrderTotal(expectedOrder, catalog));
}

function applyOrderAndVerify(expectedOrder: Order, fixture: ComponentFixture<OrderComponent>, orderService: OrderService) {
  fixture.detectChanges();
  expectedOrder.getCategoryIds().forEach(categoryId => {
    expectedOrder.getItemsForCategory(categoryId).forEach(itemId => orderService.addItem(itemId, categoryId));
  });
  tick();
  fixture.detectChanges();
  verifyOrderAndTotal(fixture.debugElement, expectedOrder, TestCatalogLoaderService.getTestCatalog());
}

function removeFirstOrderItem(fixture: ComponentFixture<OrderComponent>) {
  const removeButton = fixture.debugElement.query(By.css(".item-remove"));
  expect(removeButton).toBeTruthy();
  removeButton.triggerEventHandler("click", 0);
  tick();
  fixture.detectChanges();
}

describe("OrderComponent", () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderService: OrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderComponent, PricePipe ],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ],
      providers: [
        OrderService,
        CatalogService,
        { provide: CatalogLoaderToken, useClass: TestCatalogLoaderService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    orderService = TestBed.get(OrderService);
    orderService.clearOrder();
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should have no items without input", () => {
    verifyOrderAndTotal(fixture.debugElement, null, TestCatalogLoaderService.getTestCatalog());
  });

  it("should have one item", fakeAsync(() => {
    const expectedOrder = new Order({ category1: new Set(["item11"]) });
    applyOrderAndVerify(expectedOrder, fixture, orderService);
  }));

  it("should have one item from each category", fakeAsync(() => {
    const expectedOrder = new Order({
      category1: new Set(["item11"]),
      category2: new Set(["item22"])
    });
    applyOrderAndVerify(expectedOrder, fixture, orderService);
  }));

  it("should not fail for invalid category", fakeAsync(() => {
    const expectedOrder = new Order({ foo1: new Set(["item11"]) });
    applyOrderAndVerify(expectedOrder, fixture, orderService);
  }));

  it("should not fail for invalid item id", fakeAsync(() => {
    const expectedOrder = new Order({ category1: new Set(["itemXX"]) });
    applyOrderAndVerify(expectedOrder, fixture, orderService);
  }));

  it("should remove the only item", fakeAsync(() => {
    const expectedOrder = new Order({ category1: new Set(["item11"]) });
    applyOrderAndVerify(expectedOrder, fixture, orderService);

    removeFirstOrderItem(fixture);

    const emptyOrder = new Order();
    verifyOrderAndTotal(fixture.debugElement, emptyOrder, TestCatalogLoaderService.getTestCatalog());
  }));

  it("should remove the only item from a category and that category", fakeAsync(() => {
    const expectedOrder = new Order({
      category1: new Set(["item11"]),
      category2: new Set(["item22"])
    });
    applyOrderAndVerify(expectedOrder, fixture, orderService);

    removeFirstOrderItem(fixture);

    const updatedOrder = new Order({ category2: new Set(["item22"]) });
    verifyOrderAndTotal(fixture.debugElement, updatedOrder, TestCatalogLoaderService.getTestCatalog());
  }));

  it("should remove a single item from a category", fakeAsync(() => {
    const expectedOrder = new Order({ category1: new Set(["item11", "item12"]) });
    applyOrderAndVerify(expectedOrder, fixture, orderService);

    removeFirstOrderItem(fixture);

    const updatedOrder = new Order({ category1: new Set(["item12"]) });
    verifyOrderAndTotal(fixture.debugElement, updatedOrder, TestCatalogLoaderService.getTestCatalog());
  }));
});
