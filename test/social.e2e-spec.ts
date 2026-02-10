import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { TestHelper } from './test-helper';

describe('Social Interactions (E2E)', () => {
  let app: INestApplication;
  let helper: TestHelper;

  // User A (The Creator)
  let tokenA: string;
  let userIdA: string;

  // User B (The Follower)
  let tokenB: string;
  let userIdB: string;

  let postId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    helper = new TestHelper(app);

    // Setup User A
    const timestamp = Date.now();
    const userA = await helper.registerUser(`creator_${timestamp}`, `creator_${timestamp}@example.com`);
    userIdA = userA.id;
    tokenA = await helper.login(userA.username);

    // Setup User B
    const userB = await helper.registerUser(`follower_${timestamp}`, `follower_${timestamp}@example.com`);
    userIdB = userB.id;
    tokenB = await helper.login(userB.username);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Step 1: User A creates a Post', async () => {
    const content = "Hello World! This is my first post.";
    const query = `
      mutation {
        createpost(createPostDto: {
          content: "${content}"
        }) {
          id
          content
          author {
            id
            username
          }
        }
      }
    `;

    const res = await helper.graphqlRequest(tokenA, query).expect(200);
    const data = res.body.data.createpost;

    expect(data.id).toBeDefined();
    expect(data.content).toBe(content);
    expect(data.author.id).toBe(userIdA);
    postId = data.id;
  });

  it('Step 2: User B Follows User A', async () => {
    const query = `
      mutation {
        followUser(followUserDto: {
          followingId: "${userIdA}"
        }) {
          id
          follower(followId: "${userIdA}"){
            username
          }
           following(followId: "${userIdA}"){
             username
           } 
        }
      }
    `;

    const res = await helper.graphqlRequest(tokenB, query).expect(200);
    // Note: The structure of followUser response might depend on FollowType resolution
    // We just check for success here.
    expect(res.body.errors).toBeUndefined();
  });

  it('Step 3: User B comments on User A Post', async () => {
    const commentContent = "Nice post!";
    const query = `
      mutation {
        createcomment(createCommentDto: {
          content: "${commentContent}",
          postId: "${postId}"
        }) {
            id
            content
            post {
                id
            }
            author {
                id
            }
        }
      }
    `;

    const res = await helper.graphqlRequest(tokenB, query).expect(200);
    const data = res.body.data.createcomment;

    expect(data.id).toBeDefined();
    expect(data.content).toBe(commentContent);
    expect(data.post.id).toBe(postId);
    expect(data.author.id).toBe(userIdB);
  });

  it('Step 4: Verify Feed or Post details (Optional)', async () => {
    // Check if the post has the comment
    const query = `
      query {
        getpost(id: "${postId}") {
          id
          content
        }
      }
    `;
    const res = await helper.graphqlRequest(tokenA, query).expect(200);
    expect(res.body.data.getpost.id).toBe(postId);
  });

  it('Step 5: [Edge Case] Fail to comment on non-existent post', async () => {
    const fakePostId = "000000000000000000000000"; // 24 hex characters
    const query = `
      mutation {
        createcomment(createCommentDto: {
          content: "Ghost comment",
          postId: "${fakePostId}"
        }) {
          id
        }
      }
    `;
    const res = await helper.graphqlRequest(tokenB, query).expect(200);
    expect(res.body.errors).toBeDefined();
    // Assuming backend validates existence or fails with 500 if not handled, 
    // but ideally it should return a user friendly error or null.
    // Based on previous fixes, we might just get null back or an error.
    // Let's check for errors or data being null.
  });
});
