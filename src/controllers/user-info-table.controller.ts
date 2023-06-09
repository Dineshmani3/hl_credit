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
import {UserInfoTable} from '../models';
import {UserInfoTableRepository} from '../repositories';

export class UserInfoTableController {
  constructor(
    @repository(UserInfoTableRepository)
    public userInfoTableRepository : UserInfoTableRepository,
  ) {}

  @post('/user-info-tables')
  @response(200, {
    description: 'UserInfoTable model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserInfoTable)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInfoTable, {
            title: 'NewUserInfoTable',
            exclude: ['id'],
          }),
        },
      },
    })
    userInfoTable: Omit<UserInfoTable, 'id'>,
  ): Promise<UserInfoTable> {
    return this.userInfoTableRepository.create(userInfoTable);
  }

  @get('/user-info-tables/count')
  @response(200, {
    description: 'UserInfoTable model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserInfoTable) where?: Where<UserInfoTable>,
  ): Promise<Count> {
    return this.userInfoTableRepository.count(where);
  }

  @get('/user-info-tables')
  @response(200, {
    description: 'Array of UserInfoTable model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserInfoTable, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserInfoTable) filter?: Filter<UserInfoTable>,
  ): Promise<UserInfoTable[]> {
    return this.userInfoTableRepository.find(filter);
  }

  @patch('/user-info-tables')
  @response(200, {
    description: 'UserInfoTable PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInfoTable, {partial: true}),
        },
      },
    })
    userInfoTable: UserInfoTable,
    @param.where(UserInfoTable) where?: Where<UserInfoTable>,
  ): Promise<Count> {
    return this.userInfoTableRepository.updateAll(userInfoTable, where);
  }

  @get('/user-info-tables/{id}')
  @response(200, {
    description: 'UserInfoTable model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserInfoTable, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserInfoTable, {exclude: 'where'}) filter?: FilterExcludingWhere<UserInfoTable>
  ): Promise<UserInfoTable> {
    return this.userInfoTableRepository.findById(id, filter);
  }

  @patch('/user-info-tables/{id}')
  @response(204, {
    description: 'UserInfoTable PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserInfoTable, {partial: true}),
        },
      },
    })
    userInfoTable: UserInfoTable,
  ): Promise<void> {
    await this.userInfoTableRepository.updateById(id, userInfoTable);
  }

  @put('/user-info-tables/{id}')
  @response(204, {
    description: 'UserInfoTable PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userInfoTable: UserInfoTable,
  ): Promise<void> {
    await this.userInfoTableRepository.replaceById(id, userInfoTable);
  }

  @del('/user-info-tables/{id}')
  @response(204, {
    description: 'UserInfoTable DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userInfoTableRepository.deleteById(id);
  }
}
