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
  Party,
} from '../models';
import {UserTableRepository} from '../repositories';

export class UserTablePartyController {
  constructor(
    @repository(UserTableRepository) protected userTableRepository: UserTableRepository,
  ) { }

  @get('/user-tables/{id}/parties', {
    responses: {
      '200': {
        description: 'Array of UserTable has many Party',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Party)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Party>,
  ): Promise<Party[]> {
    return this.userTableRepository.parties(id).find(filter);
  }

  @post('/user-tables/{id}/parties', {
    responses: {
      '200': {
        description: 'UserTable model instance',
        content: {'application/json': {schema: getModelSchemaRef(Party)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof UserTable.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {
            title: 'NewPartyInUserTable',
            exclude: ['id'],
            optional: ['userTableId']
          }),
        },
      },
    }) party: Omit<Party, 'id'>,
  ): Promise<Party> {
    return this.userTableRepository.parties(id).create(party);
  }

  @patch('/user-tables/{id}/parties', {
    responses: {
      '200': {
        description: 'UserTable.Party PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Party, {partial: true}),
        },
      },
    })
    party: Partial<Party>,
    @param.query.object('where', getWhereSchemaFor(Party)) where?: Where<Party>,
  ): Promise<Count> {
    return this.userTableRepository.parties(id).patch(party, where);
  }

  @del('/user-tables/{id}/parties', {
    responses: {
      '200': {
        description: 'UserTable.Party DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Party)) where?: Where<Party>,
  ): Promise<Count> {
    return this.userTableRepository.parties(id).delete(where);
  }
}
