import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {UserInfoTable} from './user-info-table.model';
import {Party} from './party.model';

@model()
export class UserTable extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
  })
  password?: string;

  @hasOne(() => UserInfoTable)
  userInfoTable: UserInfoTable;

  @hasMany(() => Party)
  parties: Party[];

  constructor(data?: Partial<UserTable>) {
    super(data);
  }
}

export interface UserTableRelations {
  // describe navigational properties here
}

export type UserTableWithRelations = UserTable & UserTableRelations;
