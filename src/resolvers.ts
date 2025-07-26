import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Context } from "./context";

export const resolvers = {
  Query: {
    me: (_: any, __: any, ctx: Context) =>
      ctx.userId ? ctx.prisma.appUser.findUnique({ where: { id: ctx.userId } }) : null,

    shops: (_: any, __: any, { prisma }: Context) =>
      prisma.shop.findMany(),

    categories: (_: any, { shopId }: { shopId: number }, { prisma }: Context) =>
      prisma.category.findMany({ where: { shopId } }),

    items: (_: any, { categoryId }: { categoryId: number }, { prisma }: Context) =>
      prisma.item.findMany({ where: { categoryId } }),
  },

  Mutation: {
    signup: async (_: any, { shopId, username, password }: any, { prisma }: Context) => {
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.appUser.create({
        data: { shopId, username, passwordHash: hash },
      });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      return { token, user };
    },

    login: async (_: any, { username, password }: any, { prisma }: Context) => {
      const user = await prisma.appUser.findFirst({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      return { token, user };
    },

    createCategory: (_: any, args: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.category.create({ data: args });
    },
    updateCategory: (_: any, { id, ...data }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.category.update({ where: { id }, data });
    },
    deleteCategory: (_: any, { id }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.category.delete({ where: { id } }).then(() => true);
    },

    createItem: (_: any, { categoryId, name, priceCents }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.item.create({ data: { categoryId, name, priceCents } });
    },
    updateItem: (_: any, { id, ...data }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.item.update({ where: { id }, data });
    },
    deleteItem: (_: any, { id }: any, { prisma, userId }: Context) => {
      if (!userId) throw new Error("Not authenticated");
      return prisma.item.delete({ where: { id } }).then(() => true);
    },
  },
};
