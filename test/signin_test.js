//   describe('POST /users', function() {
//     it('responds with json', function(done) {
//       request(app)
//         .post('/users')
//         .send({name: 'john'})
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .end(function(err, res) {
//           if (err) return done(err);
//           return done();
//         });
//     });
//   });