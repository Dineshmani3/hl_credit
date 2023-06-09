import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserTable} from '../models';
import {UserTableRepository} from '../repositories';

export class UserTableController {
  constructor(
    @repository(UserTableRepository)
    public userTableRepository : UserTableRepository,
  ) {}

  @post('/user-tables')
  @response(200, {
    description: 'UserTable model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTable)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTable, {
            title: 'NewUserTable',
            exclude: ['id'],
          }),
        },
      },
    })
    userTable: Omit<UserTable, 'id'>,
  ): Promise<UserTable> {
    return this.userTableRepository.create(userTable);
  }

  @get('/user-tables/count')
  @response(200, {
    description: 'UserTable model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTable) where?: Where<UserTable>,
  ): Promise<Count> {
    return this.userTableRepository.count(where);
  }

  @get('/user-tables')
  @response(200, {
    description: 'Array of UserTable model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTable, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTable) filter?: Filter<UserTable>,
  ): Promise<UserTable[]> {
    return this.userTableRepository.find(filter);
  }

  @patch('/user-tables')
  @response(200, {
    description: 'UserTable PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTable, {partial: true}),
        },
      },
    })
    userTable: UserTable,
    @param.where(UserTable) where?: Where<UserTable>,
  ): Promise<Count> {
    return this.userTableRepository.updateAll(userTable, where);
  }

  @get('/user-tables/{id}')
  @response(200, {
    description: 'UserTable model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTable, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserTable, {exclude: 'where'}) filter?: FilterExcludingWhere<UserTable>
  ): Promise<UserTable> {
    return this.userTableRepository.findById(id, filter);
  }

  @patch('/user-tables/{id}')
  @response(204, {
    description: 'UserTable PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTable, {partial: true}),
        },
      },
    })
    userTable: UserTable,
  ): Promise<void> {
    await this.userTableRepository.updateById(id, userTable);
  }

  @put('/user-tables/{id}')
  @response(204, {
    description: 'UserTable PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userTable: UserTable,
  ): Promise<void> {
    await this.userTableRepository.replaceById(id, userTable);
  }

  @del('/user-tables/{id}')
  @response(204, {
    description: 'UserTable DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTableRepository.deleteById(id);
  }
}
