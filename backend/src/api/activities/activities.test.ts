import request from 'supertest';

import app from '../../app';
import { Activities } from './activities.model';

beforeAll(async () => {
  try {
    await Activities.drop();
  } catch (error) {}
});

describe('GET /api/v1/activities', () => {
  it('responds with an array of activities', async () =>
    request(app)
      .get('/api/v1/activities')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});

let id = '';
describe('POST /api/v1/activities', () => {
  it('responds with an error if the activity is invalid', async () =>
    request(app)
      .post('/api/v1/activities')
      .set('Accept', 'application/json')
      .send({
        name: '',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
      }),
  );
  it('responds with an inserted object', async () =>
    request(app)
      .post('/api/v1/activities')
      .set('Accept', 'application/json')
      .send({
        name: 'test activity',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body).toHaveProperty('name');
        expect(response.body.name).toBe('test activity');
      }),
  );
});

describe('GET /api/v1/activities/:id', () => {
  it('responds with a single activity', async () =>
    request(app)
      .get(`/api/v1/activities/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('name');
        expect(response.body.name).toBe('test activity');
      }),
  );
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .get('/api/v1/activities/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get('/api/v1/activities/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /api/v1/activities/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .put('/api/v1/activities/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .put('/api/v1/activities/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .send({
        name: 'test activity 2',
      })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single activity', async () =>
    request(app)
      .put(`/api/v1/activities/${id}`)
      .set('Accept', 'application/json')
      .send({
        name: 'test activity 2',
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('name');
        expect(response.body.name).toBe('test activity 2');
      }),
  );
});

describe('DELETE /api/v1/activities/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .delete('/api/v1/activities/adsfadsfasdfasdf')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .delete('/api/v1/activities/6306d061477bdb46f9c57fa4')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a 204 status code', (done) => {
    request(app)
      .delete(`/api/v1/activities/${id}`)
      .expect(204, done);
  });
  it('responds with a not found error', (done) => {
    request(app)
      .get(`/api/v1/activities/${id}`)
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});