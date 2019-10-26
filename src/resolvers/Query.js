import getUserId from '../utils/getUserId';

const Query = {
  posts(root, { query, first, skip, after, orderBy }, { prisma }, info) {
    const operationArgs = {
      first,
      skip,
      after,
      orderBy,
      where: {
        published: true
      }
    };

    if (query) {
      operationArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(operationArgs, info);
  },

  async post(root, { id }, { prisma, request }, info) {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [
            {
              published: true
            },
            {
              author: {
                id: userId
              }
            }
          ]
        }
      },
      info
    );

    if (posts.length === 0) throw new Error('Post not found');

    return posts[0];
  },
  async myPosts(
    root,
    { query, first, skip, after, orderBy },
    { prisma, request },
    info
  ) {
    const userId = getUserId(request);

    const operationArgs = {
      first,
      skip,
      after,
      orderBy,
      where: {
        author: {
          id: userId
        }
      }
    };

    if (query) {
      operationArgs.where.OR = [
        {
          title_contains: query
        },
        {
          body_contains: query
        }
      ];
    }

    return prisma.query.posts(operationArgs, info);
  },
  greeting(root, args, context, info) {
    return args.name ? `hello ${args.name}` : 'just hello';
  },
  users(root, { query, first, skip, after, orderBy }, { prisma }, info) {
    const operationArgs = {
      first,
      skip,
      after,
      orderBy
    };

    if (query) {
      operationArgs.where = {
        OR: [
          {
            name_contains: query
          }
        ]
      };
    }

    return prisma.query.users(operationArgs, info);
  },
  async me(root, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user(
      {
        where: {
          id: userId
        }
      },
      info
    );
  },
  comments(root, { query, first, skip, after, orderBy }, { prisma }, info) {
    const operationArgs = {
      first,
      skip,
      after,
      orderBy
    };

    if (query) {
      operationArgs.where = {
        body_contains: query
      };
    }

    return prisma.query.comments(operationArgs, info);
  }
};

export default Query;
