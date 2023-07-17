import {Entity, model, property, hasMany} from '@loopback/repository';
import {Ledger} from './ledger.model';

@model()
export class Bills extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  partyId: string;

  @property({
    type: 'string',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  billNo: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'number',
  })
  outstanding?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @hasMany(() => Ledger)
  ledgers: Ledger[];

  constructor(data?: Partial<Bills>) {
    super(data);
  }
}

export interface BillsRelations {
  // describe navigational properties here
}

export type BillsWithRelations = Bills & BillsRelations;
