"use client";

import Header from "@/app/_components/header";
import RestaurantItem from "@/app/_components/restaurant-item";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { notFound, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { searchForRestaurants } from "../_actions/search";

type RestaurantsProps = {
  userFavoriteRestaurants: UserFavoriteRestaurant[];
};

const Restaurants = ({ userFavoriteRestaurants }: RestaurantsProps) => {
  const searchParams = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const search = searchParams.get("search");

  const fetchRestaurants = useCallback(async () => {
    if (!search) {
      return;
    }

    const foundRestaurants = await searchForRestaurants(search);
    setRestaurants(foundRestaurants);
  }, [search]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  if (!search) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="px-5 py-5">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes encontrados</h2>
        <div className="flex w-full flex-col gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantItem
              key={restaurant.id}
              restaurant={restaurant}
              className="min-w-full max-w-full"
              userFavoriteRestaurants={userFavoriteRestaurants}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
