import {Entity, model, property} from '@loopback/repository';

@model()
export class UserInfoTable extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  vendor_name?: string;

  @property({
    type: 'number',
  })
  vendor_contact_no?: number;

  @property({
    type: 'string',
  })
  role?: string;

  @property({
    type: 'any',
  })
  client_id?: any;

  @property({
    type: 'string',
  })
  userTableId?: string;

  constructor(data?: Partial<UserInfoTable>) {
    super(data);
  }
}

export interface UserInfoTableRelations {
  // describe navigational properties here
}

export type UserInfoTableWithRelations = UserInfoTable & UserInfoTableRelations;
