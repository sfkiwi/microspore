//Signup Counters

module.exports = {
  global: {
    fields: {
      category: 'text',
      counter: 'counter'
    },
    key: ['category']
  },
  year: {
    fields: {
      year: 'int',
      category: 'text',
      counter: 'counter'
    },
    key: ['category', 'year'],
    clustering_order: {'year': 'DESC'}
  },
  month: {
    fields: {
      year: 'int',
      month: 'int',
      category: 'text',
      counter: 'counter'
    },
    key: [['category', 'year'], 'month'],
    clustering_order: {'month': 'DESC'}
  },
  day: {
    fields: {
      year: 'int',
      month: 'int',
      day: 'int',
      category: 'text',
      counter: 'counter'
    },
    key: [['category', 'year', 'month'], 'day'],
    clustering_order: {'day': 'DESC'}
  },
  cohort: {
    fields: {
      cohort: 'date',
      stage: 'date',
      category: 'text',
      counter: 'counter'
    },
    key: [['category', 'cohort'], 'stage'],
    clustering_order: {'stage': 'DESC'}
  },
  histogram: {
    global: {
      fields: {
        category: 'text',
        bucket: 'int',
        count: 'counter'
      },
      key: ['category', 'bucket'],
      clustering_order: { 'bucket': 'DESC' }
    },
    year: {
      fields: {
        category: 'text',
        year: 'int',
        bucket: 'int',
        count: 'counter'
      },
      key: [['category', 'year'], 'bucket'],
      clustering_order: {'bucket': 'DESC'}
    },
    month: {
      fields: {
        category: 'text',
        year: 'int',
        month: 'int',
        bucket: 'int',
        count: 'counter'
      },
      key: [['category', 'year', 'month'], 'bucket'],
      clustering_order: { 'bucket': 'DESC' }
    },
    day: {
      fields: {
        category: 'text',
        year: 'int',
        month: 'int',
        day: 'int',
        bucket: 'int',
        count: 'counter'
      },
      key: [['category', 'year', 'month', 'day'], 'bucket'],
      clustering_order: { 'bucket': 'DESC' }
    }
  }
};
  

