import {Component, Input, OnInit} from '@angular/core';
import {Catalog} from "../model/catalog";
import {Order} from "../model/order";
import {Category} from "../model/category";

import * as _ from 'lodash';
import {Item} from "../model/item";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @Input() catalog: Catalog;

  @Input() order: Order;

  constructor() { }

  ngOnInit() {
  }

  getOrderCategories(): Category[] {
    const withItems = _.keys(_.omitBy(this.order.selection, _.isEmpty)).sort();
    return _.map(withItems, id => {
      return this.catalog.getCategory(id);
    });
  }

  getOrderCategoryItems(categoryId: string): Item[] {
    const orderCategoryItemIds = this.order.selection[categoryId];
    const categoryItems = this.catalog.getCategory(categoryId).items;

    return <Item[]>_.sortBy(
      _.values(
        _.pickBy(categoryItems, item => {
          return orderCategoryItemIds.indexOf(item.id) !== -1;
        })
      ),
      ['id']);
  }

  getOrderTotal(): number {
    return _.reduce(this.getOrderCategories(), (prevTotal: number, category) => {
      const categoryTotal = _.reduce(this.getOrderCategoryItems(category.id), (itemPrevTotal: number, item: Item) => {
        return itemPrevTotal + item.value;
      }, 0);
      return prevTotal + categoryTotal;
    }, 0);
  }
}
