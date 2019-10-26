import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(root, args, { request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === root.id) {
        return root.email;
      }

      return null;
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(root, args, { prisma }, info) {
      return prisma.query.posts(
        {
          where: {
            published: true,
            author: {
              id: root.id
            }
          }
        },
        info
      );
    }
  }
};

export default User;
