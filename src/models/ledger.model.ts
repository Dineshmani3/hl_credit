import {Entity, model, property} from '@loopback/repository';

@model()
export class Ledger extends Entity {
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
  })
  debit?: number;

  @property({
    type: 'number',
  })
  credit?: number;

  @property({
    type: 'number',
  })
  balance?: number;


  constructor(data?: Partial<Ledger>) {
    super(data);
  }
}

export interface LedgerRelations {
  // describe navigational properties here
}

export type LedgerWithRelations = Ledger & LedgerRelations;
