import {async, TestBed} from "@angular/core/testing";

import {Set, Map} from "immutable";
import {OrderService} from "./order-service";

function verifyOrderObject(expectedOrder: Map<string, Set<string>>, actualOrder: Map<string, Set<string>>) {
  expect(expectedOrder).toBeTruthy();
  expect(actualOrder).toBeTruthy();
  expectedOrder.keySeq().toArray().forEach(value => {
    expect(actualOrder.has(value)).toBeTruthy();
    const expectedItems = expectedOrder.get(value);
    const actualItems = actualOrder.get(value);
    expect(expectedItems.size).toEqual(actualItems.size);
    expectedItems.toArray().forEach(item => expect(actualItems.contains(item)).toBeTruthy());
  });
}

function verifyOrderWithService(expectedOrder: Map<string, Set<string>>, orderService: OrderService) {
  expect(expectedOrder).toBeTruthy();
  expectedOrder.keySeq().toArray().forEach(value => {
    const expectedItems = expectedOrder.get(value);
    const actualItems = orderService.getItemsForCategory(value);
    expect(expectedItems.size).toEqual(actualItems.size);
    expectedItems.toArray().forEach(item => expect(actualItems.contains(item)).toBeTruthy());
  });
}

function verifyOrderAndObservable(expectedOrder: Map<string, Set<string>>, orderService: OrderService, done: DoneFn) {
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

  it("should have one item", (done: DoneFn) => {
    const expectedOrder = Map({
      category1: Set(["item11"])
    });
    orderService.addItem("item11", "category1");
    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should have one item from each category", (done: DoneFn) => {
    const expectedOrder = Map({
      category1: Set(["item11"]),
      category2: Set(["item22"])
    });

    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should not fail for invalid category", (done: DoneFn) => {
    const expectedOrder = Map({
      foo1: Set(["item11"])
    });
    orderService.addItem("item11", "foo1");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  /* tslint:disable-next-line:no-identical-functions */
  it("should not fail for invalid item id", (done: DoneFn) => {
    const expectedOrder = Map({
      category1: Set(["itemXX"])
    });
    orderService.addItem("itemXX", "category1");

    verifyOrderAndObservable(expectedOrder, orderService, done);
  });

  it("should remove the only item", (done: DoneFn) => {
    orderService.addItem("item11", "category1");
    orderService.removeItem("item11", "category1");

    const emptyOrder: Map<string, Set<string>> = Map();
    verifyOrderAndObservable(emptyOrder, orderService, done);
  });

  it("should remove the only item from a category and that category", (done: DoneFn) => {
    orderService.addItem("item11", "category1");
    orderService.addItem("item22", "category2");

    orderService.removeItem("item11", "category1");
    const updatedOrder = Map({
      category2: Set(["item22"])
    });
    verifyOrderAndObservable(updatedOrder, orderService, done);
  });

  it("should remove a single item from a category", (done: DoneFn) => {
    orderService.addItem("item11", "category1");
    orderService.addItem("item12", "category1");

    orderService.removeItem("item11", "category1");
    const updatedOrder = Map({
      category1: Set(["item12"])
    });
    verifyOrderAndObservable(updatedOrder, orderService, done);
  });
});
