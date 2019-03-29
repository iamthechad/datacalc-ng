/* tslint:disable:no-unused-variable no-duplicate-string */
import {Component, DebugElement} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatCardModule, MatIconModule, MatListModule} from "@angular/material";
import {By} from "@angular/platform-browser";
import {Map} from "immutable";

import {Catalog} from "../model/catalog";
import {CatalogComponent} from "./catalog.component";

@Component({
  template: `
    <mt-catalog [catalog]=catalog [selectedCategory]=selectedCategory
                (categorySelected)="categorySelected($event)"></mt-catalog>`
})
class TestHostComponent {
  catalog: Catalog;
  selectedCategory: string;

  categorySelected(categoryId: string) {
    this.selectedCategory = categoryId;
  }
}

function verifyCategoryItems(fixture: ComponentFixture<TestHostComponent>, catalog: Catalog) {
  const categoryButtons = fixture.debugElement.queryAll(By.css(".catalog-entry"));
  expect(categoryButtons.length).toEqual(catalog.entries.valueSeq().size);
  categoryButtons.forEach((button: DebugElement, index: number) => {
    expect(button.nativeElement.textContent).toContain(`category ${index + 1}`);
  });
}

function verifySelectedCategory(fixture: ComponentFixture<TestHostComponent>, expectedCategoryName: string) {
  const selectedCategoryButton = fixture.debugElement.query(By.css(".selected"));
  expect(selectedCategoryButton).toBeTruthy();
  expect(selectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
}

function verifyAndGetUnselectedCategory(fixture: ComponentFixture<TestHostComponent>, expectedCategoryName: string) {
  const unSelectedCategoryButton = fixture.debugElement.query(By.css("button:not(.selected)"));
  expect(unSelectedCategoryButton).toBeTruthy();
  expect(unSelectedCategoryButton.nativeElement.textContent).toContain(expectedCategoryName);
  return unSelectedCategoryButton;
}

describe("CatalogComponent Behavior", () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const catalog: Catalog = {
    entries: Map({
      foo2: {
        id: "category2",
        name: "category 2",
        icon: "category2",
        items: {}
      },
      foo1: {
        id: "category1",
        name: "category 1",
        icon: "category1",
        items: {}
      }
    })
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent, TestHostComponent],
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

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have no categories without input", () => {
    const categoryButtons = fixture.debugElement.queryAll(By.css(".catalog-entry"));
    expect(categoryButtons.length).toEqual(0);
  });

  it("should set the catalog with no selected category", () => {
    component.catalog = catalog;
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    const selectedCategoryButton = fixture.debugElement.query(By.css(".selected"));
    expect(selectedCategoryButton).not.toBeTruthy();
  });

  it("should set the catalog with selected category", () => {
    component.catalog = catalog;
    component.selectedCategory = "category1";
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    verifySelectedCategory(fixture, "category 1");
  });

  it("should set selected category", async(() => {
    component.catalog = catalog;
    component.selectedCategory = "category1";
    fixture.detectChanges();
    verifyCategoryItems(fixture, catalog);
    const unSelectedCategoryButton = verifyAndGetUnselectedCategory(fixture, "category 2");
    unSelectedCategoryButton.triggerEventHandler("click", 0);
    expect(component.selectedCategory).toEqual("category2");
    fixture.detectChanges();
    verifySelectedCategory(fixture, "category 2");
  }));
});

describe("CatalogComponent Unit", () => {
  let component: CatalogComponent;
  let fixture: ComponentFixture<CatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should correctly map category icon types", () => {
    const iconMapping = [
      {
        category: "icon-coin-dollar",
        expectedIcon: "fa-dollar-sign"
      },
      {
        category: "icon-user",
        expectedIcon: "fa-user"
      },
      {
        category: "icon-library",
        expectedIcon: "fa-balance-scale"
      },
      {
        category: "icon-profile",
        expectedIcon: "fa-id-card"
      },
      {
        category: "icon-flag",
        expectedIcon: "fa-flag"
      },
      {
        category: "foo",
        expectedIcon: ""
      }
    ];
    iconMapping.forEach(mapping => {
      expect(mapping.expectedIcon).toEqual(component.translateIcon(mapping.category));
    });
  });
});
