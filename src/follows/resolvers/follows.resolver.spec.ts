import { Test, TestingModule } from '@nestjs/testing';
import { FollowsResolver } from './follows.resolver';

describe('FollowsResolver', () => {
  let resolver: FollowsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowsResolver],
    }).compile();

    resolver = module.get<FollowsResolver>(FollowsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
