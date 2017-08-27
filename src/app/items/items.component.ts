import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output
} from '@angular/core';
import {Item} from '../model/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent {
  @Input() items: Item[];
  @Input() orderItems: string[];

  @Output() itemSelected = new EventEmitter<string>();

  onItemSelected(itemId: string): void {
    this.itemSelected.emit(itemId);
  }

  isItemSelected(item: Item): boolean {
    return this.orderItems.indexOf(item.id) !== -1;
  }
}
