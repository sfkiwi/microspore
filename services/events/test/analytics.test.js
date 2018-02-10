process.env.KEYSPACE = 'eventstest';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../analytics/index');
const db = require('../lib/db');
const { OrdersNewOrder, PrimeTrialSignup, PrimeTrialOptout, Counters } = db.models.Events;
const { LocalDate, Long } = db.models.datatypes;
const _ = require('underscore');

chai.use(chaiHttp);

var should = chai.should(); 
var expect = chai.expect;

const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: process.env.KEYSPACE });

const days = [
  _.range(1, 4), //J
  [] //F
];

const years = _.range(2017, 2019); // years

const tests = {
  category: ['trialoptout', 'trialsignup', 'neworders'],
  type: {
    'counters': ['Year', 'Month', 'Day']
  },
  years: years,
  days: days
};

describe('/stats', function () {

  describe('/counter', function() {

    tests.category.forEach(category => {
      
      describe(`/${category}`, function () { //for each counter type

        /**************************************************************
         *
         *  C O U N T E R  |  G L O B A L
         * 
         * *************************************************************/

        describe('/ (global)', function() {
          
          // Global
          before(function () {

            let query = 'TRUNCATE countersglobal';
            return client.execute(query)
              .then(() => {
                return Counters.Global.updateAsync({ category: category }, { counter: Long.fromInt(1) });
              });
          });

          after(function() {
            let query = 'TRUNCATE countersglobal';
            return client.execute(query);
          });
          
          let url = `/api/stats/counter/${category}`;

          it('should return status code 200', function() {
            
            return chai.request(app)
              .get(url)
              .then(function (res) {
                expect(res).to.have.status(200);
              })
              .catch(function (err) {
                throw err;
              });
          });

          it('should return json', function() {
            return chai.request(app)
              .get(url)
              .then(function (res) {
                expect(res).to.be.json;
              })
              .catch(function (err) {
                throw err;
              });
          });

          it('should return a single counter', function() {
            return chai.request(app)
              .get(url)
              .then(function (res) {
                expect(res.body.length).to.equal(1);
              })
              .catch(function (err) {
                throw err;
              });
          });

          it('should return the correct counter', function () {
            return chai.request(app)
              .get(url)
              .then(function (res) {
                expect(res.body[0].category).to.equal(category);
              })
              .catch(function (err) {
                throw err;
              });
          });

          it('should return correct counter value', function () {
            return chai.request(app)
              .get(url)
              .then(function (res) {
                expect(res.body[0].counter).to.equal('1');
              })
              .catch(function (err) {
                throw err;
              });  
          });
        });

        /**************************************************************
         *
         *  C O U N T E R  |  Y E A R
         * 
         * *************************************************************/


        describe('/year', function () {

          // Global
          before(function () {

            let query = 'TRUNCATE countersyear';
            return client.execute(query)
              .then(() => {
                return Promise.all(
                  tests.years.map(year => {
                    return Counters.Year.updateAsync({category: category, year: year }, { counter: Long.fromInt(1) });
                  }));
              });
          });

          after(function () {
            let query = 'TRUNCATE countersyear';
            return client.execute(query);
          });

          tests.years.forEach(year => {
            let url = `/api/stats/counter/${category}/${year}`;

            it('should return status code 200', function () {

              return chai.request(app)
                .get(url)
                .then(function (res) {
                  expect(res).to.have.status(200);
                })
                .catch(function (err) {
                  throw err;
                });
            });

            it('should return json', function () {
              return chai.request(app)
                .get(url)
                .then(function (res) {
                  expect(res).to.be.json;
                })
                .catch(function (err) {
                  throw err;
                });
            });

            it('should return a single counter', function () {
              return chai.request(app)
                .get(url)
                .then(function (res) {
                  expect(res.body.length).to.equal(1);
                })
                .catch(function (err) {
                  throw err;
                });
            });

            it('should return the correct counter', function () {
              return chai.request(app)
                .get(url)
                .then(function (res) {
                  expect(res.body[0].category).to.equal(category);
                })
                .catch(function (err) {
                  throw err;
                });
            });

            it('should return correct counter value', function () {
              return chai.request(app)
                .get(url)
                .then(function (res) {
                  expect(res.body[0].counter).to.equal('1');
                })
                .catch(function (err) {
                  throw err;
                });
            });
          });
        });

        /**************************************************************
         *
         *  C O U N T E R  |  M O N T H
         * 
         * *************************************************************/

        describe('/month', function () {

          // Global
          before(function () {

            let query = 'TRUNCATE countersmonth';
            return client.execute(query)
              .then(() => {
                return Promise.all(
                  tests.years.map(year => {
                    return tests.days.map((days, month) => {
                      return Counters.Month.updateAsync({ category: category, year: year, month: month + 1 }, { counter: Long.fromInt(1) });
                    });
                  }));
              });
          });

          after(function () {
            let query = 'TRUNCATE countersmonth';
            return client.execute(query);
          });

          tests.years.forEach(year => {
            tests.days.forEach((days, month) => {

              let url = `/api/stats/counter/${category}/${year}/${month + 1}`;
  
              it('should return status code 200', function () {
  
                return chai.request(app)
                  .get(url)
                  .then(function (res) {
                    expect(res).to.have.status(200);
                  })
                  .catch(function (err) {
                    throw err;
                  });
              });
  
              it('should return json', function () {
                return chai.request(app)
                  .get(url)
                  .then(function (res) {
                    expect(res).to.be.json;
                  })
                  .catch(function (err) {
                    throw err;
                  });
              });
  
              it('should return a single counter', function () {
                return chai.request(app)
                  .get(url)
                  .then(function (res) {
                    expect(res.body.length).to.equal(1);
                  })
                  .catch(function (err) {
                    throw err;
                  });
              });
  
              it('should return the correct counter', function () {
                return chai.request(app)
                  .get(url)
                  .then(function (res) {
                    expect(res.body[0].category).to.equal(category);
                  })
                  .catch(function (err) {
                    throw err;
                  });
              });
  
              it('should return correct counter value', function () {
                return chai.request(app)
                  .get(url)
                  .then(function (res) {
                    expect(res.body[0].counter).to.equal('1');
                  })
                  .catch(function (err) {
                    throw err;
                  });
              });
            });
          });
        });

        /**************************************************************
         *
         *  C O U N T E R  |  D A Y
         * 
         * *************************************************************/

        describe('/day', function () {

          // Global
          before(function () {

            let query = 'TRUNCATE countersday';
            return client.execute(query)
              .then(() => {
                return Promise.all(
                  tests.years.map(year => {
                    return tests.days.map((days, month) => {
                      return days.map(day => {
                        return Counters.Day.updateAsync({ category: category, year: year, month: month + 1, day: day }, { counter: Long.fromInt(1) });
                      });
                    });
                  }));
              });
          });

          after(function () {
            let query = 'TRUNCATE countersday';
            return client.execute(query);
          });

          tests.years.forEach(year => {
            tests.days.forEach((days, month) => {
              days.forEach(day => {

                let url = `/api/stats/counter/${category}/${year}/${month + 1}/${day}`;
    
                it('should return status code 200', function () {
    
                  return chai.request(app)
                    .get(url)
                    .then(function (res) {
                      expect(res).to.have.status(200);
                    })
                    .catch(function (err) {
                      throw err;
                    });
                });
    
                it('should return json', function () {
                  return chai.request(app)
                    .get(url)
                    .then(function (res) {
                      expect(res).to.be.json;
                    })
                    .catch(function (err) {
                      throw err;
                    });
                });
    
                it('should return a single counter', function () {
                  return chai.request(app)
                    .get(url)
                    .then(function (res) {
                      expect(res.body.length).to.equal(1);
                    })
                    .catch(function (err) {
                      throw err;
                    });
                });
    
                it('should return the correct counter', function () {
                  return chai.request(app)
                    .get(url)
                    .then(function (res) {
                      expect(res.body[0].category).to.equal(category);
                    })
                    .catch(function (err) {
                      throw err;
                    });
                });
    
                it('should return correct counter value', function () {
                  return chai.request(app)
                    .get(url)
                    .then(function (res) {
                      expect(res.body[0].counter).to.equal('1');
                    })
                    .catch(function (err) {
                      throw err;
                    });
                });
              });
            });
          });
        });
      });
    });
  });
  describe('/cohort', function() {
    describe('/trialoptout', function() {
     
      before(function () {

        let query = 'TRUNCATE counterscohort';
        return client.execute(query)
          .then(() => {
            return Promise.all([
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 9)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 10)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 11)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 12)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 13)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 14)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 15)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 16)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 17)) }, { counter: Long.fromInt(1) }),
              Counters.Cohort.updateAsync({ category: 'trialoptout', cohort: LocalDate.fromDate(new Date(2017, 10, 8)), stage: LocalDate.fromDate(new Date(2017, 10, 18)) }, { counter: Long.fromInt(1) })
            ]);
          });
      });

      after(function () {
        let query = 'TRUNCATE counterscohort';
        return client.execute(query);
      });

      let url = '/api/stats/cohort/trialoptout/2017/11/8';

      it('should return status code 200', function () {

        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res).to.have.status(200);
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return json', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res).to.be.json;
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return an array of counters counter', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res.body.length).to.equal(10);
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return the correct counter', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res.body[0].category).to.equal('trialoptout');
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return correct counter value', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            res.body.forEach(item => {
              expect(item.counter).to.equal('1');
            });
          })
          .catch(function (err) {
            throw err;
          });
      });

    });
  });
  describe('/histogram', function() {
    describe('/trialsignup', function () {

      before(function () {

        let query = 'TRUNCATE countershistogramglobal';
        return client.execute(query)
          .then(() => {
            return Promise.all([
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 0 }, { count: Long.fromInt(1) }),
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 10 }, { count: Long.fromInt(1) }),
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 50 }, { count: Long.fromInt(1) }),
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 100 }, { count: Long.fromInt(1) }),
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 500 }, { count: Long.fromInt(1) }),
              Counters.Histogram.Global.updateAsync({ category: 'trialsignup', bucket: 1000 }, { count: Long.fromInt(1) }),
            ]);
          });
      });

      after(function () {
        let query = 'TRUNCATE countershistogramglobal';
        return client.execute(query);
      });

      let url = '/api/stats/histogram/trialsignup';

      it('should return status code 200', function () {

        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res).to.have.status(200);
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return json', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res).to.be.json;
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return an array of counters counter', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res.body.length).to.equal(6);
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return the correct counter', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            expect(res.body[0].category).to.equal('trialsignup');
          })
          .catch(function (err) {
            throw err;
          });
      });

      it('should return correct counter value', function () {
        return chai.request(app)
          .get(url)
          .then(function (res) {
            res.body.forEach(item => {
              expect(item.count).to.equal('1');
            });
          })
          .catch(function (err) {
            throw err;
          });
      });
    });
  });
});
