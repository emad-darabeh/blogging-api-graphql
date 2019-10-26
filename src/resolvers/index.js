import { extractFragmentReplacements } from 'prisma-binding';

// query
import Query from './Query';

// mutation
import Mutation from './Mutation';

// subscription
import Subscription from './Subscription';

// custom
import User from './User';
import Post from './Post';
import Comment from './Comment';

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment
};

export const fragmentReplacements = extractFragmentReplacements(resolvers);
