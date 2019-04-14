/* tslint:disable:no-duplicate-string */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ItemsComponent } from "./items.component";
import {MatButtonModule, MatCardModule, MatListModule} from "@angular/material";
import {PricePipe} from "../price.pipe";
import {By} from "@angular/platform-browser";
import {Item} from "../model/item";
import {Component, DebugElement} from "@angular/core";
import {Util} from "../common/util";

@Component({
  template: `
    <mt-items [items]=items [orderItems]=orderItems (itemSelected)="itemSelected($event)"></mt-items>
    `
})
class TestItemsHostComponent {
  items: Item[];
  orderItems: Set<string>;
  selectedItem: string;
  itemSelected(itemId: string) { this.selectedItem = itemId; }
}

function verifyCard(card: DebugElement, expectedItem: Item, cardShouldBeSelected = false) {
  const cardId = card.nativeElement.attributes.id.textContent;
  expect(cardId).toEqual(expectedItem.id);
  const cardName = card.query(By.css(".item-title"));
  expect(cardName.nativeElement.textContent).toEqual(expectedItem.name);
  const cardPrice = card.query(By.css(".item-price"));
  expect(cardPrice.nativeElement.textContent).toEqual(Util.formatPrice(expectedItem.value));
  if (expectedItem.hasOwnProperty("description")) {
    const cardDescription = card.query(By.css(".item-description"));
    expect(cardDescription).toBeTruthy();
    const descriptionText = cardDescription.nativeElement.textContent;
    expectedItem.description.forEach(line => {
      expect(descriptionText).toContain(line);
    });
  }
  if (expectedItem.hasOwnProperty("note")) {
    const cardNote = card.query(By.css(".item-note"));
    expect(cardNote).toBeTruthy();
    expect(cardNote.nativeElement.textContent).toEqual(expectedItem.note);
  }
  const cardCommercialSource = card.query(By.css(".item-commercial"));
  expect(cardCommercialSource.nativeElement.textContent).toEqual(expectedItem.commercialSource);
  if (expectedItem.hasOwnProperty("probableSource")) {
    const cardProbableSource = card.query(By.css(".item-probable"));
    expect(cardProbableSource.nativeElement.textContent).toEqual(expectedItem.probableSource);
  }
  const cardSelectControl = card.query(By.css(".item-select"));
  if (cardShouldBeSelected) {
    expect(cardSelectControl).not.toBeTruthy();
  } else {
    expect(cardSelectControl).toBeTruthy();
  }
}

describe("ItemsComponent", () => {
  let component: TestItemsHostComponent;
  let fixture: ComponentFixture<TestItemsHostComponent>;
  const items: Item[] = [
    {
      id: "item1",
      category: "category",
      name: "Item 1",
      commercialSource: "Item 1 Source",
      value: 1234
    },
    {
      id: "item2",
      category: "category",
      name: "Item 2",
      commercialSource: "Item 2 Source",
      value: 4567
    },
    {
      id: "item3",
      category: "category",
      name: "Full Item",
      commercialSource: "Item 3 Source",
      probableSource: "Item 3 Probable",
      description: ["Description 1", "Description 2"],
      note: "Item note",
      value: 1234
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsComponent, TestItemsHostComponent, PricePipe ],
      imports: [
        MatCardModule,
        MatButtonModule,
        MatListModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestItemsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should have no items without input", () => {
    const itemList = fixture.debugElement.queryAll(By.css(".category-item"));
    expect(itemList.length).toEqual(0);
  });

  it("should show items with none selected", () => {
    component.items = items;
    fixture.detectChanges();
    const itemCards = fixture.debugElement.queryAll(By.css(".category-item"));
    expect(itemCards.length).toEqual(items.length);
    itemCards.forEach((card: DebugElement, index: number) => {
      verifyCard(card, items[index]);
    });
  });

  it("should show items with none selected matching order", () => {
    component.items = items;
    component.orderItems = new Set(["abc", "123"]);
    fixture.detectChanges();
    const itemCards = fixture.debugElement.queryAll(By.css(".category-item"));
    expect(itemCards.length).toEqual(items.length);
    itemCards.forEach((card: DebugElement, index: number) => {
      verifyCard(card, items[index]);
    });
  });

  it("should show items with one selected matching order", () => {
    component.items = items;
    component.orderItems = new Set(["item2"]);
    fixture.detectChanges();
    const expectedSelectIndex = 1;
    const itemCards = fixture.debugElement.queryAll(By.css(".category-item"));
    expect(itemCards.length).toEqual(items.length);
    itemCards.forEach((card: DebugElement, index: number) => {
      verifyCard(card, items[index], expectedSelectIndex === index);
    });
  });

  it("should send items selected event", () => {
    component.items = items;
    fixture.detectChanges();
    const itemCards = fixture.debugElement.queryAll(By.css(".category-item"));
    expect(itemCards.length).toEqual(items.length);
    itemCards.forEach((card: DebugElement, index: number) => {
      verifyCard(card, items[index]);
    });
    const cardSelectControl = itemCards[0].query(By.css(".item-select"));
    expect(cardSelectControl).toBeTruthy();
    cardSelectControl.triggerEventHandler("click", 0);
    expect(component.selectedItem).toEqual("item1");
  });
});
