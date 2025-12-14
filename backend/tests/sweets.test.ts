import request from 'supertest';
import app from '../src/app';

async function register(email: string, role: 'USER' | 'ADMIN' = 'USER') {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'password123', role });
  return res.body.token as string;
}

describe('Sweets API', () => {
  it('requires authentication', async () => {
    const res = await request(app).get('/api/sweets');
    expect(res.status).toBe(401);
  });

  it('creates and lists sweets', async () => {
    const token = await register('user1@example.com');
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Candy', category: 'Chocolate', price: 2.5, quantity: 5 });
    expect(createRes.status).toBe(201);

    const listRes = await request(app).get('/api/sweets').set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].name).toBe('Candy');
  });

  it('searches sweets by name and price range', async () => {
    const token = await register('user2@example.com');
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${token}`).send({ name: 'Lollipop', category: 'Sugar', price: 1.0, quantity: 3 });
    await request(app).post('/api/sweets').set('Authorization', `Bearer ${token}`).send({ name: 'Caramel', category: 'Sugar', price: 3.0, quantity: 2 });

    const res = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ name: 'car', minPrice: 2 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Caramel');
  });

  it('purchases and prevents out-of-stock purchases', async () => {
    const token = await register('user3@example.com');
    const sweet = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Gum', category: 'Chew', price: 0.5, quantity: 1 });

    const purchase1 = await request(app)
      .post(`/api/sweets/${sweet.body.id}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(purchase1.status).toBe(200);
    expect(purchase1.body.quantity).toBe(0);

    const purchase2 = await request(app)
      .post(`/api/sweets/${sweet.body.id}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(purchase2.status).toBe(400);
  });

  it('restocks requires admin', async () => {
    const userToken = await register('user4@example.com');
    const adminToken = await register('admin1@example.com', 'ADMIN');

    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Mint', category: 'Fresh', price: 1.2, quantity: 1 });

    const denyRes = await request(app)
      .post(`/api/sweets/${sweetRes.body.id}/restock`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ amount: 5 });
    expect(denyRes.status).toBe(403);

    const okRes = await request(app)
      .post(`/api/sweets/${sweetRes.body.id}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ amount: 5 });
    expect(okRes.status).toBe(200);
    expect(okRes.body.quantity).toBe(6);
  });

  it('delete requires admin', async () => {
    const userToken = await register('user5@example.com');
    const adminToken = await register('admin2@example.com', 'ADMIN');

    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Nougat', category: 'Nutty', price: 4, quantity: 2 });

    const denyRes = await request(app)
      .delete(`/api/sweets/${sweetRes.body.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(denyRes.status).toBe(403);

    const okRes = await request(app)
      .delete(`/api/sweets/${sweetRes.body.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(okRes.status).toBe(200);
  });
});
