/* tslint:disable:no-unused-variable no-duplicate-string */
import {Component, DebugElement} from "@angular/core";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {MatCardModule, MatIconModule, MatListModule} from "@angular/material";
import {By} from "@angular/platform-browser";

import {Catalog} from "../model/catalog";
import {CatalogComponent} from "./catalog.component";
import {CatalogLoaderToken} from "../model/catalog-loader";
import {TestCatalogLoaderService} from "../test/service/test-catalog-loader.service";
import {CatalogService} from "../service/catalog-service";

@Component({
  template: `
    <mt-catalog [selectedCategory]=selectedCategory
                (categorySelected)="categorySelected($event)"></mt-catalog>`
})
class TestHostComponent {
  selectedCategory: string;

  categorySelected(categoryId: string) {
    this.selectedCategory = categoryId;
  }
}

function verifyCategoryItems(fixture: ComponentFixture<TestHostComponent>, catalog: Catalog) {
  const categoryButtons = fixture.debugElement.queryAll(By.css(".catalog-entry"));
  expect(categoryButtons.length).toEqual(catalog.getCategories().length);
  categoryButtons.forEach((button: DebugElement, index) => {
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
  let catalogService: CatalogService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogComponent, TestHostComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatListModule
      ],
      providers: [
        CatalogService,
        { provide: CatalogLoaderToken, useClass: TestCatalogLoaderService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    catalogService = TestBed.get(CatalogService);
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set the catalog with no selected category", () => {
    fixture.detectChanges();
    verifyCategoryItems(fixture, TestCatalogLoaderService.getTestCatalog());
    const selectedCategoryButton = fixture.debugElement.query(By.css(".selected"));
    expect(selectedCategoryButton).not.toBeTruthy();
  });

  it("should set the catalog with selected category", () => {
    component.selectedCategory = "category1";
    fixture.detectChanges();
    verifyCategoryItems(fixture, TestCatalogLoaderService.getTestCatalog());
    verifySelectedCategory(fixture, "category 1");
  });

  it("should set selected category", async(() => {
    component.selectedCategory = "category1";
    fixture.detectChanges();
    verifyCategoryItems(fixture, TestCatalogLoaderService.getTestCatalog());
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
      ],
      providers: [
        CatalogService,
        { provide: CatalogLoaderToken, useClass: TestCatalogLoaderService }
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
