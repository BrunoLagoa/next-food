"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";

export const toggleFavoriteRestaurant = async (
  userId: string,
  restaurantId: string,
) => {
  const userAlreadyFavorited = await db.userFavoriteRestaurant.findFirst({
    where: {
      userId,
      restaurantId,
    },
  });

  if (userAlreadyFavorited) {
    await db.userFavoriteRestaurant.delete({
      where: {
        id: userAlreadyFavorited.id,
      },
    });
  } else {
    await db.userFavoriteRestaurant.create({
      data: {
        userId,
        restaurantId,
      },
    });
  }

  return revalidatePath(`/`);
};
