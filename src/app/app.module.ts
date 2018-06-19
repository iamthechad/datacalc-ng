import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonModule, MatCardModule, MatIconModule, MatListModule, MatToolbarModule} from "@angular/material";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";

import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {CatalogComponent} from "./catalog/catalog.component";

import {environment} from "../environments/environment";

import "hammerjs";
import {ItemsComponent} from "./items/items.component";
import {OrderComponent} from "./order/order.component";
import {PricePipe} from "./price.pipe";
import {CatalogService} from "./service/catalog-service";
import {OrderService} from "./service/order-service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CatalogComponent,
    ItemsComponent,
    OrderComponent,
    PricePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [CatalogService, OrderService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
