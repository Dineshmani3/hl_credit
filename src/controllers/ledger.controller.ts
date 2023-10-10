import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Ledger} from '../models';
import {BeatRepository, BillsRepository, LedgerRepository, PartyRepository} from '../repositories';

export class LedgerController {
  constructor(
    @repository(LedgerRepository)
    public ledgerRepository: LedgerRepository,
    @repository(BillsRepository)
    public billsRepository: BillsRepository,
    @repository(BeatRepository)
    public beatRepository: BeatRepository,
    @repository(PartyRepository)
    public partyRepository: PartyRepository,
  ) { }

  @post('/ledgers')
  @response(200, {
    description: 'Ledger model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ledger)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {
            title: 'NewLedger',
            exclude: ['id'],
          }),
        },
      },
    })
    ledger: Omit<Ledger, 'id'>,
  ): Promise<Ledger> {
    const party = await this.partyRepository.findOne({where: {party_name: ledger.partyId}});

    if (party) {
      const balance = ((party.outStanding || 0) + (ledger.debit || 0)) - (ledger.credit || 0)
      ledger['balance'] = balance
      await this.partyRepository.updateById(party.id, {outStanding: balance})

      const bill = await this.billsRepository.findOne({where: {billNo: ledger.billNo}})
      if (bill) {
        const billOutstanding = ((bill.outstanding || 0) + (ledger.debit || 0)) - (ledger.credit || 0)
        await this.billsRepository.updateById(bill.id, {outstanding: billOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('bill not found')
      }
      const beat = await this.beatRepository.findOne({where: {name: party.beat}})
      if (beat) {
        const beatOutstanding = ((beat.outstanding || 0) + (ledger.debit || 0)) - (ledger.credit || 0)

        await this.beatRepository.updateById(beat.id, {outstanding: beatOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('beat not found')
      }


    }

    else {
      throw new HttpErrors.NotFound('party not found')

    }

    return this.ledgerRepository.create(ledger);
  }

  @get('/ledgers/count')
  @response(200, {
    description: 'Ledger model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.ledgerRepository.count(where);
  }

  @get('/ledgers')
  @response(200, {
    description: 'Array of Ledger model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ledger, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ledger) filter?: Filter<Ledger>,
  ): Promise<Ledger[]> {
    return this.ledgerRepository.find(filter);
  }

  @patch('/ledgers')
  @response(200, {
    description: 'Ledger PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
    @param.where(Ledger) where?: Where<Ledger>,
  ): Promise<Count> {
    return this.ledgerRepository.updateAll(ledger, where);
  }

  @get('/ledgers/{id}')
  @response(200, {
    description: 'Ledger model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ledger, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ledger, {exclude: 'where'}) filter?: FilterExcludingWhere<Ledger>
  ): Promise<Ledger> {
    return this.ledgerRepository.findById(id, filter);
  }

  @get('/bill/{billNo}/ledgers', {
    responses: {
      '200': {
        description: 'Array of Ledger associated with Bill',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Ledger}},
          },
        },
      },
    },
  })
  async findLedgerByBillNo(@param.path.string('billNo') billNo: string): Promise<Ledger[]> {
    return this.ledgerRepository.find({where: {billNo}});
  }

  @post('/ledgers/{id}')
  @response(204, {
    description: 'Ledger PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ledger, {partial: true}),
        },
      },
    })
    ledger: Ledger,
  ): Promise<void> {
    const party = await this.partyRepository.findOne({where: {party_name: ledger.partyId}});

    if (party) {
      const balance = ((party.outStanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)
      ledger['balance'] = balance
      await this.partyRepository.updateById(party.id, {outStanding: balance})

      const bill = await this.billsRepository.findOne({where: {billNo: ledger.billNo}})
      if (bill) {
        const billOutstanding = ((bill.outstanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)
        await this.billsRepository.updateById(bill.id, {outstanding: billOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('bill not found')
      }
      const beat = await this.beatRepository.findOne({where: {name: party.beat}})
      if (beat) {
        const beatOutstanding = ((beat.outstanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)

        await this.beatRepository.updateById(beat.id, {outstanding: beatOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('beat not found')
      }

    }

    else {
      throw new HttpErrors.NotFound('party not found')

    }

    await this.ledgerRepository.updateById(id, ledger);
  }

  @put('/ledgers/{id}')
  @response(204, {
    description: 'Ledger PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ledger: Ledger,
  ): Promise<void> {
    await this.ledgerRepository.replaceById(id, ledger);
  }

  @del('/ledgers/{id}')
  @response(204, {
    description: 'Ledger DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const ledger = await this.ledgerRepository.findById(id)
    const party = await this.partyRepository.findOne({where: {party_name: ledger.partyId}});

    if (party) {
      const balance = ((party.outStanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)
      ledger['balance'] = balance
      await this.partyRepository.updateById(party.id, {outStanding: balance})

      const bill = await this.billsRepository.findOne({where: {billNo: ledger.billNo}})
      if (bill) {
        const billOutstanding = ((bill.outstanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)
        await this.billsRepository.updateById(bill.id, {outstanding: billOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('bill not found')
      }
      const beat = await this.beatRepository.findOne({where: {name: party.beat}})
      if (beat) {
        const beatOutstanding = ((beat.outstanding || 0) - (ledger.debit || 0)) + (ledger.credit || 0)

        await this.beatRepository.updateById(beat.id, {outstanding: beatOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('beat not found')
      }

    }
    else {
      throw new HttpErrors.NotFound('party not found')

    }
    await this.ledgerRepository.deleteById(id);
  }
}
