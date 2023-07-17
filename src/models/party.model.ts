import {Entity, model, property, hasMany} from '@loopback/repository';
import {Bills} from './bills.model';
import {Ledger} from './ledger.model';

@model()
export class Party extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  party_code?: string;

  @property({
    type: 'string',
  })
  party_name?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'any',
  })
  beat?: any;

  @property({
    type: 'string',
  })
  userTableId?: string;

  @property({
    type: 'string',
  })
  outStanding?: string;

  @hasMany(() => Bills)
  bills: Bills[];

  @hasMany(() => Ledger)
  ledgers: Ledger[];

  constructor(data?: Partial<Party>) {
    super(data);
  }
}

export interface PartyRelations {
  // describe navigational properties here
}

export type PartyWithRelations = Party & PartyRelations;
