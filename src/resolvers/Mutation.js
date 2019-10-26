import bcrypt from 'bcryptjs';

// utils
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  //******  user mutations  *******//

  async createUser(root, { data }, { prisma }, info) {
    data.password = await hashPassword(data.password);
    const user = await prisma.mutation.createUser({ data });
    return {
      user,
      token: generateToken(user.id)
    };
  },

  async deleteUser(root, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },

  async updateUser(root, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password);
    }

    return prisma.mutation.updateUser({ data, where: { id: userId } }, info);
  },

  async loginUser(root, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email } });

    if (!user) throw new Error('unable to authenticate');

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) throw new Error('password is not correct');

    return {
      user,
      token: generateToken(user.id)
    };
  },

  //******  post mutations  *******//

  async createPost(root, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: { connect: { id: userId } }
        }
      },
      info
    );
  },

  async deletePost(root, { id }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!postExists) throw new Error('Unable to delete post');
    return prisma.mutation.deletePost({ where: { id } }, info);
  },

  async updatePost(root, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });
    const postPublished = await prisma.exists.Post({
      id,
      published: true
    });

    if (!postExists) throw new Error('Unable to update post');

    if (postPublished && !data.published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      });
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },

  //******  comment mutations  *******//

  async createComment(root, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postPublished = await prisma.exists.Post({
      id: data.post,
      published: true
    });

    if (!postPublished) throw new Error('Unable to find post');

    return prisma.mutation.createComment(
      {
        data: {
          ...data,
          author: { connect: { id: userId } },
          post: { connect: { id: data.post } }
        }
      },
      info
    );
  },

  async deleteComment(root, { id }, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) throw new Error('Unable to delete comment');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },

  async updateComment(root, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) throw new Error('Unable to update comment');

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  }
};

export default Mutation;
