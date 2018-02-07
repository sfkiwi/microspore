module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: { '$db_function': 'uuid()' }
    },
    userId: 'varchar',
    created: {
      type: 'timeuuid',
      default: { '$db_function': 'now()' }
    },
    signUp: 'date',
    day: 'date'
  },
  key: ['day', 'created'],
  clustering_order: { 'created': 'desc' }
};