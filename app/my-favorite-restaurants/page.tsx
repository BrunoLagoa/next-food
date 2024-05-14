import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import Header from "../_components/header";
import RestaurantItem from "../_components/restaurant-item";

const MyFavoriteRestaurants = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound();
  }

  const favoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      restaurant: true,
    },
  });

  const isFavoriteRestaurantsEmpty = !favoriteRestaurants.length;

  return (
    <>
      <Header />
      <div className="px-5 py-5">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes favoritos</h2>
        <div className="flex w-full flex-col gap-6">
          {isFavoriteRestaurantsEmpty && (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm font-normal text-gray-400">
                Você ainda não tem restaurantes favoritos
              </p>
            </div>
          )}

          {favoriteRestaurants?.map(({ restaurant }) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
              userFavoriteRestaurants={favoriteRestaurants}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyFavoriteRestaurants;
