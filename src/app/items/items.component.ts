import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SelectableItem} from "../model/selectable-item";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  @Input() items: SelectableItem[];

  @Output() itemSelected = new EventEmitter<string>();

  addItemToOrder(itemId) {
    this.itemSelected.emit(itemId);
  }
}
