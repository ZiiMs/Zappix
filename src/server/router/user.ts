import { z } from 'zod';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const UserRouter = createProtectedRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query('friends.getAll', {
    async resolve({ ctx }) {
      console.log('Freidns!Q@?#');
      const friends = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          FriendOf: {
            select: {
              User: true,
              Messages: true,
            },
          },
          Friend: {
            select: {
              Friend: true,
              Messages: true,
            },
          },
        },
      });
      const Friends = friends?.FriendOf.map(({ User, ...fri }) => ({
        ...fri,
        Friend: User,
      }));
      let newFriends = friends?.Friend;
      if (Friends && friends) {
        newFriends = Friends.concat(friends.Friend);
        console.log('werwerefoipedrjgoier1', newFriends, Friends);
      }
      return newFriends;
    },
  })
  .query('friends.get', {
    input: z.object({
      friend: z.string(),
    }),
    async resolve({ ctx, input }) {
      const friends = await ctx.prisma.friend.findFirstOrThrow({
        where: {
          friendId: input.friend,
        },
        include: {
          Friend: true,
          Messages: {
            include: {
              Reciever: {
                include: {
                  Friend: true,
                  User: true,
                },
              },
            },
          },
        },
      });

      return friends;
    },
  })
  .mutation('create', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newUser = await ctx.prisma.user.update({
        data: {
          username: input.username,
          isRegistered: true,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return newUser;
    },
  })
  .mutation('friend.add', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newUser = await ctx.prisma.user.update({
        where: {
          username: input.username,
        },
        data: {
          Friend: {
            create: {
              friendId: ctx.session.user.id,
            },
          },
        },
      });
      return newUser;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
        include: {
          accounts: true,
          sessions: true,
        },
      });
      return deletedUser;
    },
  });

