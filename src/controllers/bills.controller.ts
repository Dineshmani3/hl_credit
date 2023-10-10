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
import {Bills} from '../models';
import {BeatRepository, BillsRepository, LedgerRepository, PartyRepository} from '../repositories';


export class BillsController {
  constructor(
    @repository(BillsRepository)
    public billsRepository: BillsRepository,
    @repository(PartyRepository)
    public partyrepository: PartyRepository,
    @repository(BeatRepository)
    public beatrepository: BeatRepository,
    @repository(LedgerRepository)
    public ledgerrepository: LedgerRepository,
  ) { }

  @post('/bills')
  @response(200, {
    description: 'Bills model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bills)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bills, {
            title: 'NewBills',
            exclude: ['id'],
          }),
        },
      },
    })
    bills: Omit<Bills, 'id'>,
  ): Promise<Bills> {
    // const party = await this.partyrepository.findById(bills.partyId)
    const party = await this.partyrepository.findOne({where: {party_name: bills.partyId}});

    if (party) {
      const totalOutstanding = (party.outStanding || 0) + (bills.outstanding || 0)
      await this.partyrepository.updateById(party.id, {outStanding: totalOutstanding})

      const newLedger = {
        date: bills.date,
        billNo: bills.billNo,
        debit: bills.outstanding,
        balance: totalOutstanding,
        partyId: bills.partyId
      }
      await this.ledgerrepository.create(newLedger)

      const beat = await this.beatrepository.findOne({where: {name: party.beat}})
      if (beat) {
        const beatOutstanding = (bills.outstanding || 0) + (beat.outstanding || 0)
        await this.beatrepository.updateById(beat.id, {outstanding: beatOutstanding})
      }
      else {
        throw new HttpErrors.NotFound('beat not found')
      }


    }
    else {
      throw new HttpErrors.NotFound('party not found')

    }


    return this.billsRepository.create(bills);
  }


  // @post('/bills-bulk', {
  //   responses: {
  //     '200': {
  //       description: 'bills model instance',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(Bills)
  //         }
  //       },
  //     },
  //   },
  // })
  // async createAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: {
  //           type: 'array',
  //           items: getModelSchemaRef(Bills, {
  //             title: 'NewBills',
  //             exclude: ['id'],
  //           }),
  //         }
  //       },
  //     },
  //   })
  //   bills: [Omit<Bills, 'id'>]
  // ): Promise<void> {
  //   bills.map(async (bill) => {
  //     const party = await this.partyrepository.findOne({where: {party_name: bill.partyId}});

  //     if (party) {
  //       const totalOutstanding = (party.outStanding || 0) + (bill.outstanding || 0);
  //       await this.partyrepository.updateById(party.id, {outStanding: totalOutstanding});

  //       const newLedger = {
  //         date: bill.date,
  //         billNo: bill.billNo,
  //         debit: bill.outstanding,
  //         balance: totalOutstanding,
  //         partyId: bill.partyId
  //       };
  //       await this.ledgerrepository.create(newLedger);

  //       const beat = await this.beatrepository.findOne({where: {name: party.beat}});
  //       if (beat) {
  //         const beatOutstanding = (bill.outstanding || 0) + (beat.outstanding || 0);
  //         await this.beatrepository.updateById(beat.id, {outstanding: beatOutstanding});
  //       }
  //       else {
  //         throw new HttpErrors.NotFound('beat not found');
  //       }


  //     }
  //     else {
  //       throw new HttpErrors.NotFound('party not found');

  //     }

  //   })
  //   await this.billsRepository.createAll(bills)
  // }

  @post('/bills-bulk', {
    responses: {
      '200': {
        description: 'bills model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bills),
          },
        },
      },
    },
  })
  async createAll(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Bills, {
              title: 'NewBills',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    bills: Omit<Bills, 'id'>[],
  ): Promise<void> {
    // Use Promise.all to wait for all async operations to complete
    await Promise.all(
      bills.map(async (bill) => {
        try {
          const party = await this.partyrepository.findOne({
            where: {party_name: bill.partyId},
          });

          if (party) {
            const totalOutstanding = (party.outStanding || 0) + (bill.outstanding || 0);
            await this.partyrepository.updateById(party.id, {outStanding: totalOutstanding});

            const newLedger = {
              date: bill.date,
              billNo: bill.billNo,
              debit: bill.outstanding,
              balance: totalOutstanding,
              partyId: bill.partyId,
            };
            await this.ledgerrepository.create(newLedger);

            const beat = await this.beatrepository.findOne({where: {name: party.beat}});
            if (beat) {
              const beatOutstanding = (bill.outstanding || 0) + (beat.outstanding || 0);
              await this.beatrepository.updateById(beat.id, {outstanding: beatOutstanding});
            } else {
              throw new HttpErrors.NotFound('beat not found');
            }
          } else {
            throw new HttpErrors.NotFound('party not found');
          }
        } catch (error) {
          // Handle errors here, you might want to log them or respond with appropriate HTTP status codes.
          console.error('Error creating bill:', error);
          throw new HttpErrors.InternalServerError('Error creating bill');
        }
      })
    );

    // After all bills are processed, create them in the BillsRepository
    await this.billsRepository.createAll(bills);
  }

  @get('/bills/count')
  @response(200, {
    description: 'Bills model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bills) where?: Where<Bills>,
  ): Promise<Count> {
    return this.billsRepository.count(where);
  }

  @get('/bills')
  @response(200, {
    description: 'Array of Bills model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bills, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bills) filter?: Filter<Bills>,
  ): Promise<Bills[]> {
    return this.billsRepository.find(filter);
  }

  @patch('/bills')
  @response(200, {
    description: 'Bills PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bills, {partial: true}),
        },
      },
    })
    bills: Bills,
    @param.where(Bills) where?: Where<Bills>,
  ): Promise<Count> {
    return this.billsRepository.updateAll(bills, where);
  }

  @get('/bills/{id}')
  @response(200, {
    description: 'Bills model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bills, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bills, {exclude: 'where'}) filter?: FilterExcludingWhere<Bills>
  ): Promise<Bills> {
    return this.billsRepository.findById(id, filter);
  }

  @get('/billByNo/{billNo}')
  @response(200, {
    description: 'Bills model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bills, {includeRelations: true}),
      },
    },
  })
  async findByBillNo(
    @param.path.string('billNo') billNo: string,
  ): Promise<Bills | null> {
    return this.billsRepository.findOne({where: {billNo}});
  }


  @post('/bills/{id}')
  @response(204, {
    description: 'Bills PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bills, {partial: true}),
        },
      },
    })
    bills: Bills,
  ): Promise<void> {
    // const party = await this.partyrepository.findOne({where: {party_name: bills.partyId}});

    // if (party) {
    //   const totalOutstanding = (party.outStanding || 0) + (bills.outstanding || 0)
    //   await this.partyrepository.updateById(party.id, {outStanding: totalOutstanding})

    //   const newLedger = {
    //     date: bills.date,
    //     billNo: bills.billNo,
    //     debit: bills.outstanding,
    //     balance: totalOutstanding,
    //     partyId: bills.partyId
    //   }
    //   await this.ledgerrepository.create(newLedger)

    //   const beat = await this.beatrepository.findOne({where: {name: party.beat}})
    //   if (beat) {
    //     const beatOutstanding = (bills.outstanding || 0) + (beat.outstanding || 0)
    //     await this.beatrepository.updateById(beat.id, {outstanding: beatOutstanding})
    //   }
    //   else {
    //     throw new HttpErrors.NotFound('beat not found')
    //   }


    // }
    // else {
    //   throw new HttpErrors.NotFound('party not found')

    // }

    await this.billsRepository.updateById(id, bills);
  }

  @put('/bills/{id}')
  @response(204, {
    description: 'Bills PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bills: Bills,
  ): Promise<void> {
    await this.billsRepository.replaceById(id, bills);
  }

  @del('/bills/{id}')
  @response(204, {
    description: 'Bills DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.billsRepository.deleteById(id);
  }
}
