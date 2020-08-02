//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('~/controllers/session_controller.js');
let should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

chai.use(chaiHttp);

// Login Test
describe('Login', () => {
  beforeEach(done => {
    done();
  });
  /*
   * Test the /login route
   */
  // .set('X-API-Key', 'foobar') // HEADER

  describe('/POST login', () => {
    it('it USERNAME is wrong', done => {
      let body = {
        username: '',
        password: '123456'
      };
      chai
        .request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.pet.should.have.property('msg').eql('Username is wrong');
          done();
        });
    });

    it('it PASSWORD is wrong', done => {
      let body = {
        username: 'nhocbangchu95',
        password: ''
      };
      chai
        .request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('msg').eql('Password is wrong');
          done();
        });
    });

    it('it LOGIN success', done => {
      let body = {
        username: 'nhocbangchu95',
        password: '123456'
      };
      chai
        .request(server)
        .post('/login')
        .send(body)
        .end((err, res) => {
          expect(res).have.status(200);
          expect(res.body).have.property('access_token');
          expect(res.body).have.property('user_id');
          expect(res.body).have.property('refresh_token');

          let { access_token, user_id, refresh_token } = res.body;

          assert.typeOf(access_token, 'string');
          assert.typeOf(user_id, 'string');
          assert.typeOf(refresh_token, 'string');
          done();
        });
    });
  });
});

