import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export class TestHelper {
    constructor(private app: INestApplication) { }

    /**
     * Registers a new user and returns the user object.
     */
    async registerUser(username: string, email: string) {
        const query = `
      mutation {
        createUser(createUserInput: {
          username: "${username}",
          email: "${email}",
          password: "password123"
        }) {
          id
          username
          email
        }
      }
    `;
        const res = await request(this.app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200);

        // If there are errors, throw them to fail the test immediately
        if (res.body.errors) {
            throw new Error(JSON.stringify(res.body.errors));
        }

        return res.body.data.createUser;
    }

    /**
     * Logs in a user and returns the access token.
     */
    async login(username: string): Promise<string> {
        const query = `
      mutation {
        login(loginInput: {
          username: "${username}",
          password: "password123"
        })
      }
    `;
        const res = await request(this.app.getHttpServer())
            .post('/graphql')
            .send({ query })
            .expect(200);

        if (res.body.errors) {
            throw new Error(JSON.stringify(res.body.errors));
        }

        return res.body.data.login;
    }

    /**
     * Helper to perform an authenticated GraphQL request.
     */
    graphqlRequest(token: string, query: string) {
        return request(this.app.getHttpServer())
            .post('/graphql')
            .set('Authorization', `Bearer ${token}`)
            .send({ query });
    }
}
