import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function findById(userId, include) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userId,
      },
      include: !!include && {
        board: true,
        comment: true,
      },
    });
    return user;
  } catch (err) {
    console.error(err);
  }
}

function filterUserData(user) {
  const { password, refreshToken, ...rest } = user;
  return rest;
}
const userRepository = {
  findById,
  filterUserData,
};
export default userRepository;
