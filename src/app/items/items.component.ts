import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Item} from "../model/item";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  @Input() items: Item[];

  @Output() itemSelected = new EventEmitter<string>();

  addItemToOrder(itemId) {
    this.itemSelected.emit(itemId);
  }
}
