import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { TestHelper } from './test-helper';

describe('User Onboarding (E2E)', () => {
  let app: INestApplication;
  let helper: TestHelper;
  let authToken: string;
  let userId: string;
  const uniqueId = Date.now();
  const username = `testuser_${uniqueId}`;
  const email = `testuser_${uniqueId}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    helper = new TestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Step 1: Register a new user', async () => {
    const user = await helper.registerUser(username, email);

    expect(user).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
    expect(user.id).toBeDefined();
    userId = user.id;
  });

  it('Step 2: Login and get token', async () => {
    const token = await helper.login(username);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    authToken = token;
  });

  it('Step 3: Update User Profile (Bio)', async () => {
    const newBio = "I am a test user";
    const query = `
      mutation {
        updateUser(updateUserInput: {
          id: "${userId}",
          bio: "${newBio}"
        }) {
          id
          username
          bio
        }
      }
    `;

    const res = await helper.graphqlRequest(authToken, query)
      .expect(200);

    const data = res.body.data.updateUser;

    expect(data.id).toBe(userId);
    expect(data.bio).toBe(newBio);
  });

  it('Step 4: Verify Profile Update', async () => {
    const query = `
      query {
        getuser {
          id
          username
          bio
        }
      }
    `;

    // Note: getuser likely uses the token to identify the current user
    const res = await helper.graphqlRequest(authToken, query)
      .expect(200);

    const data = res.body.data.getuser;
    expect(data.id).toBe(userId);
    expect(data.bio).toBe("I am a test user");
  });

  it('Step 5: [Edge Case] Fail to Register with existing username/email', async () => {
    // Attempt to register the same user again
    // Expect error
    const query = `
      mutation {
        createUser(createUserInput: {
          username: "${username}",
          email: "${email}",
          password: "password123"
        }) {
          id
        }
      }
    `;
    const res = await helper.graphqlRequest("", query).expect(200);
    // Even if status is 200 (GraphQL often returns 200 for errors), check for errors body
    expect(res.body.errors).toBeDefined();
    // Use regex to be flexible with exact error message wording
    expect(res.body.errors[0].message).toMatch(/duplicate|exist/i);
  });

  it('Step 6: [Edge Case] Fail to Login with wrong password', async () => {
    const query = `
      mutation {
        login(loginInput: {
          username: "${username}",
          password: "wrongpassword"
        })
      }
    `;
    const res = await helper.graphqlRequest("", query).expect(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/Unauthorized|Invalid/i);
  });

  it('Step 7: [Edge Case] Fail to access protected route without token', async () => {
    const query = `
      query {
        getuser {
          id
          username
        }
      }
    `;
    // Sending empty token or no token
    const res = await helper.graphqlRequest("", query).expect(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toMatch(/Unauthorized|forbidden|Invalid/i);
  });
});
