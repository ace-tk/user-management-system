import request from 'supertest';
import app from '../src/app';
import prisma from '../src/database/prisma';

// Generate unique test data based on timestamp to avoid collisions
const generateMockUser = () => {
  const timestamp = Date.now().toString();
  return {
    name: 'Test User',
    email: `test${timestamp}@example.com`,
    primaryMobile: `9${timestamp.slice(-9)}`,
    aadhaar: `${timestamp.slice(-12).padStart(12, '1')}`,
    pan: `ABCDE${timestamp.slice(-4)}F`,
    dateOfBirth: '1990-01-01',
    currentAddress: '123 Test St, Testing City',
    permanentAddress: '123 Test St, Testing City',
  };
};

describe('User APIs Integration Tests', () => {
  let createdUserId: string;
  let testUserPayload: ReturnType<typeof generateMockUser>;

  beforeAll(async () => {
    testUserPayload = generateMockUser();
  });

  afterAll(async () => {
    // Clean up test data safely to prevent database pollution
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@example.com',
        },
      },
    });
    // Disconnect Prisma after tests are complete
    await prisma.$disconnect();
  });

  describe('POST /api/users - Create User', () => {
    it('should create a new user successfully', async () => {
      const res = await request(app)
        .post('/api/users')
        .send(testUserPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUserPayload.email);

      // Save ID for later tests
      createdUserId = res.body.data.id;
    });

    it('should fail if email is duplicate', async () => {
      const duplicatePayload = generateMockUser();
      duplicatePayload.email = testUserPayload.email; // Use same email

      const res = await request(app)
        .post('/api/users')
        .send(duplicatePayload);

      // Prisma throws P2002 for unique constraint violations, which is caught and returns 500
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Unique constraint failed');
    });

    it('should fail if PAN is duplicate', async () => {
      const duplicatePayload = generateMockUser();
      duplicatePayload.pan = testUserPayload.pan; // Use same PAN

      const res = await request(app)
        .post('/api/users')
        .send(duplicatePayload);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Unique constraint failed');
    });

    it('should fail if Aadhaar is duplicate', async () => {
      const duplicatePayload = generateMockUser();
      duplicatePayload.aadhaar = testUserPayload.aadhaar; // Use same Aadhaar

      const res = await request(app)
        .post('/api/users')
        .send(duplicatePayload);

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Unique constraint failed');
    });
  });

  describe('GET /api/users - Get Users', () => {
    it('should retrieve users with pagination', async () => {
      const res = await request(app).get('/api/users?page=1&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('totalRecords');
      expect(res.body.data).toHaveProperty('totalPages');
      expect(res.body.data).toHaveProperty('currentPage');
      expect(Array.isArray(res.body.data.users)).toBe(true);
      
      // Ensure the created user is potentially in the list (since it's page 1, ordered desc usually)
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/users/:id - Update User', () => {
    it('should update an existing user', async () => {
      const res = await request(app)
        .put(`/api/users/${createdUserId}`)
        .send({
          name: 'Updated Test User',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Test User');
      expect(res.body.data.email).toBe(testUserPayload.email); // Unchanged
    });

    it('should return 404 for non-existent user update', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .put(`/api/users/${fakeId}`)
        .send({
          name: 'Fake Update',
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id - Delete User', () => {
    it('should soft delete an existing user', async () => {
      const res = await request(app).delete(`/api/users/${createdUserId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('User deleted successfully');

      // Verify the user is actually soft deleted
      const checkRes = await request(app).get(`/api/users/${createdUserId}`);
      expect(checkRes.status).toBe(404);
      expect(checkRes.body.message).toBe('User not found');
    });

    it('should return 404 for already deleted or non-existent user', async () => {
      // createdUserId is already deleted from previous test
      const res = await request(app).delete(`/api/users/${createdUserId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('User not found');
    });
  });
});
