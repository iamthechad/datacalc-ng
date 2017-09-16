import {TypedRecord} from 'typed-immutable-record';
import {Category} from './category';

export interface CategoryRecord extends TypedRecord<CategoryRecord>, Category {}
