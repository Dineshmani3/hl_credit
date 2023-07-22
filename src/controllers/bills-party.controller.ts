import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Bills,
  Party,
} from '../models';
import {BillsRepository} from '../repositories';

export class BillsPartyController {
  constructor(
    @repository(BillsRepository)
    public billsRepository: BillsRepository,
  ) { }

  @get('/bills/{id}/party', {
    responses: {
      '200': {
        description: 'Party belonging to Bills',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Party),
          },
        },
      },
    },
  })
  async getParty(
    @param.path.string('id') id: typeof Bills.prototype.id,
  ): Promise<Party> {
    return this.billsRepository.party(id);
  }
}
