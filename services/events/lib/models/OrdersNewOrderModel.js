module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { '$db_function': 'uuid()' }
    },
    userId: 'varchar',
    orderId: 'varchar',
    amount: 'int',
    created: {
      type: 'timeuuid',
      default: { '$db_function': 'now()' }
    },
    day: 'date'
  },
  key: ['day', 'created'],
  clustering_order: {'created': 'desc'}
};