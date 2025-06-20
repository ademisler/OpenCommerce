import handler from '../pages/api/orders';
import { createMocks } from 'node-mocks-http';

jest.mock('next-auth/next', () => ({
  getServerSession: () => Promise.resolve({ user: { email: 'a@example.com' } })
}));

export const mockRes = () => {
  const { req, res } = createMocks({ method: 'GET' });
  return { req, res };
};

describe('/api/orders', () => {
  it('returns 400 when storeId missing', async () => {
    const { req, res } = mockRes();
    await handler(req as any, res as any);
    expect(res._getStatusCode()).toBe(400);
  });
});
