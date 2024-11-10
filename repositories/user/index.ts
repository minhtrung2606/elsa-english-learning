import prisma from '@/prisma/client';

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    select: { id: true, username: true },
    where: { username },
  })
};
