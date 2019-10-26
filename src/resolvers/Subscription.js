import getUserId from '../utils/getUserId';

const Subscription = {
  comment: {
    subscribe(root, { postId }, { prisma }, info) {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe(root, args, { prisma }, info) {
      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  },
  myPost: {
    subscribe(root, args, { prisma, request }, info) {
      const userId = getUserId(request);

      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId
              }
            }
          }
        },
        info
      );
    }
  }
};

export default Subscription;
