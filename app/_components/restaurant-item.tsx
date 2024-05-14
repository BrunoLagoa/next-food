"use client";

import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { useSession } from "next-auth/react";
import { isRestaurantFavorited } from "../_helpers/is-restaurant-favorited";
import useToggleFavoriteRestaurant from "../_hooks/use-toggle-favorite-restaurant";

type RestaurantItemProps = {
  restaurant: Restaurant;
  className?: string;
  userFavoriteRestaurants?: UserFavoriteRestaurant[];
};

const RestaurantItem = ({
  restaurant,
  userFavoriteRestaurants,
  className,
}: RestaurantItemProps) => {
  const { data } = useSession();
  const userId = data?.user?.id;

  const isFavorite = userFavoriteRestaurants
    ? isRestaurantFavorited(restaurant.id, userFavoriteRestaurants)
    : false;

  const { handleToggleFavoriteRestaurant } = useToggleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId: data?.user?.id,
    isRestaurantFavorited: isFavorite,
  });

  return (
    <div className={cn("min-w-[266px] max-w-[266px]", className)}>
      <div className="space-y-3">
        <div className="relative h-[136px] w-full">
          <Link href={`/restaurants/${restaurant.id}`}>
            <Image
              src={restaurant.imageUrl}
              alt={restaurant.name}
              fill
              className="rounded-lg object-cover"
            />
          </Link>

          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-white px-2 py-[2px]">
            <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">5.0</span>
          </div>

          {userId && (
            <Button
              size="icon"
              className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-600 ${isFavorite && "bg-primary hover:bg-gray-700"}`}
              onClick={handleToggleFavoriteRestaurant}
            >
              <HeartIcon size={16} className="fill-white" />
            </Button>
          )}
        </div>

        <Link href={`/restaurants/${restaurant.id}`}>
          <p className="text-sm font-semibold">{restaurant.name}</p>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <BikeIcon size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">
                {Number(restaurant.deliveryFee) === 0
                  ? "Entrega grátis"
                  : formatCurrency(Number(restaurant.deliveryFee))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TimerIcon size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">
                {restaurant.deliveryTimeMinutes} min
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantItem;
