import {async, TestBed} from "@angular/core/testing";

import {OrderService} from "./order-service";
import {Order} from "../model/order";

function verifyOrderObject(expectedOrder: Order, actualOrder: Order) {
  expect(expectedOrder).toBeTruthy();
  expect(actualOrder).toBeTruthy();
  expect(expectedOrder).toEqual(actualOrder);
}

function verifyOrderWithService(expectedOrder: Order, orderService: OrderService) {
  expect(expectedOrder).toBeTruthy();
  expectedOrder.getCategoryIds().forEach(categoryId => {
    const expectedItems = expectedOrder.getItemsForCategory(categoryId);
    const actualItems = orderService.getItemsForCategory(categoryId);
    expect(expectedItems).toEqual(actualItems);
  });
}

function verifyOrderAndObservable(expectedOrder: Order, orderService: OrderService, done: DoneFn) {
  verifyOrderObject(expectedOrder, orderService.getCurrentOrder());
  verifyOrderWithService(expectedOrder, orderService);
  orderService.getOrderObservable().subscribe(order => {
    verifyOrderObject(expectedOrder, order);
    done();
  });
}

describe("OrderService", () => {
  let orderService: OrderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ OrderService ]
    });
  }));

  beforeEach(() => {
    orderService = TestBed.get(OrderService);
    orderService.clearOrder();
  });

  it("should be created", () => {
    expect(orderService).toBeTruthy();
  });

  it("should have one item", (done) => {
    const expectedOrder = new Order({
      category1: new Set(["item11"])
    });
    orderService.addItem("item11", "category1");
    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should have one item from each category", (done) => {
    const expectedOrder = new Order({
      category1: new Set(["item11"]),
      category2: new Set(["item22"])
    });

    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should not fail for invalid category", (done) => {
    const expectedOrder = new Order({
      foo1: new Set(["item11"])
    });
    orderService.addItem("item11", "foo1");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  /* tslint:disable-next-line:no-identical-functions */
  it("should not fail for invalid item id", (done) => {
    const expectedOrder = new Order({
      category1: new Set(["itemXX"])
    });
    orderService.addItem("itemXX", "category1");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should remove the only item", (done) => {
    orderService.addItem("item11", "category1");
    orderService.removeItem("item11", "category1");

    const emptyOrder = new Order();
    verifyOrderAndObservable(emptyOrder, orderService, done);
  });

  it("should remove the only item from a category and that category", (done) => {
    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");

    orderService.removeItem("item11", "category1");
    const updatedOrder = new Order({
      category2: new Set(["item22"])
    });
    verifyOrderAndObservable(updatedOrder, orderService, done);
  });

  it("should remove a single item from a category", (done) => {
    orderService.addItem("item11", "category1");
    orderService.addItem("item12", "category1");

    orderService.removeItem("item11", "category1");
    const updatedOrder = new Order({
      category1: new Set(["item12"])
    });
    verifyOrderAndObservable(updatedOrder, orderService, done);
  });
});
