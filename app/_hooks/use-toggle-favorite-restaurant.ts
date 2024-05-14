import { toast } from "sonner";
import { toggleFavoriteRestaurant } from "../_actions/restaurant";
import { useRouter } from "next/navigation";

type useToggleFavoriteRestaurantProps = {
  userId?: string;
  restaurantId: string;
  isRestaurantFavorited: boolean;
};

const useToggleFavoriteRestaurant = ({
  userId,
  restaurantId,
  isRestaurantFavorited,
}: useToggleFavoriteRestaurantProps) => {
  const router = useRouter();

  const handleToggleFavoriteRestaurant = async () => {
    if (!userId) return;

    try {
      await toggleFavoriteRestaurant(userId, restaurantId);

      const FavoriteMessage = isRestaurantFavorited
        ? "Restaurante removido dos favoritos"
        : "Restaurante adicionado aos favoritos";

      toast(FavoriteMessage, {
        action: {
          label: "Ver favoritos",
          onClick: () => router.push("/my-favorite-restaurants"),
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao favoritar restaurante");
    }
  };

  return {
    handleToggleFavoriteRestaurant,
  };
};

export default useToggleFavoriteRestaurant;
