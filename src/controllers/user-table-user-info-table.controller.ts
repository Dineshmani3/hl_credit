import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  UserTable,
  UserInfoTable,
} from '../models';
import {UserTableRepository} from '../repositories';

export class UserTableUserInfoTableController {
  constructor(
    @repository(UserTableRepository) protected userTableRepository: UserTableRepository,
  ) { }

  @get('/user-tables/{id}/user-info-table', {
    responses: {
      '200': {
        description: 'UserTable has one UserInfoTable',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserInfoTable),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserInfoTable>,
  ): Promise<UserInfoTable> {
    return this.userTableRepository.userInfoTable(id).get(filter);
  }

  @post('/user-tables/{id}/user-info-table', {
    responses: {
      '200': {
        description: 'UserTable model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserInfoTable)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserTable.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInfoTable, {
            title: 'NewUserInfoTableInUserTable',
            exclude: ['id'],
            optional: ['userTableId']
          }),
        },
      },
    }) userInfoTable: Omit<UserInfoTable, 'id'>,
  ): Promise<UserInfoTable> {
    return this.userTableRepository.userInfoTable(id).create(userInfoTable);
  }

  @patch('/user-tables/{id}/user-info-table', {
    responses: {
      '200': {
        description: 'UserTable.UserInfoTable PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInfoTable, {partial: true}),
        },
      },
    })
    userInfoTable: Partial<UserInfoTable>,
    @param.query.object('where', getWhereSchemaFor(UserInfoTable)) where?: Where<UserInfoTable>,
  ): Promise<Count> {
    return this.userTableRepository.userInfoTable(id).patch(userInfoTable, where);
  }

  @del('/user-tables/{id}/user-info-table', {
    responses: {
      '200': {
        description: 'UserTable.UserInfoTable DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserInfoTable)) where?: Where<UserInfoTable>,
  ): Promise<Count> {
    return this.userTableRepository.userInfoTable(id).delete(where);
  }
}
