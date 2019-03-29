import {TypedRecord} from "typed-immutable-record";
import {Item} from "./item";

export interface ItemRecord extends TypedRecord<ItemRecord>, Item {}
