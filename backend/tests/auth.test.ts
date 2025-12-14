import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('registers a user and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('user@example.com');
  });

  it('prevents duplicate registration', async () => {
    await request(app).post('/api/auth/register').send({ email: 'dupe@example.com', password: 'password123' });
    const res = await request(app).post('/api/auth/register').send({ email: 'dupe@example.com', password: 'password123' });
    expect(res.status).toBe(400);
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/auth/register').send({ email: 'login@example.com', password: 'password123' });
    const res = await request(app).post('/api/auth/login').send({ email: 'login@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'nope@example.com', password: 'wrong' });
    expect(res.status).toBe(400);
  });
});
