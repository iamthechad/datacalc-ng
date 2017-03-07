import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import {AngularFireModule} from "angularfire2";
import { HeaderComponent } from './header/header.component';
import { CatalogComponent } from './catalog/catalog.component';

export const firebaseConfig = {
  apiKey: "AIzaSyACjFU8ux-Df1De0gAgBeIDxXMEvafAiQc",
  authDomain: "glaring-torch-2436.firebaseapp.com",
  databaseURL: "https://glaring-torch-2436.firebaseio.com",
  storageBucket: "glaring-torch-2436.appspot.com",
  messagingSenderId: "844761162138"
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CatalogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
