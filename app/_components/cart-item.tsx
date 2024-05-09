import Image from "next/image";
import { CartContext, CartProduct } from "../_context/cart";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useContext } from "react";

type CartItemProps = {
  cartProduct: CartProduct;
};

const CartItem = ({ cartProduct }: CartItemProps) => {
  const {
    decreaseProductQuantity,
    increaseProductQuantity,
    removeProductFromCart,
  } = useContext(CartContext);

  const handleDecreaseProductQuantity = () => {
    decreaseProductQuantity(cartProduct.id);
  };

  const handleIncreaseProductQuantity = () => {
    increaseProductQuantity(cartProduct.id);
  };

  const handleRemoveProductFromCart = () => {
    removeProductFromCart(cartProduct.id);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <Image
            src={cartProduct.imageUrl}
            alt={cartProduct.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-xs">{cartProduct.name}</h3>

          <div className="flex items-center gap-1">
            <h4 className="text-sm font-semibold">
              {formatCurrency(
                calculateProductTotalPrice(cartProduct) * cartProduct.quantity,
              )}
            </h4>
            {cartProduct.discountPercentage === 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(
                  Number(cartProduct.price) * cartProduct.quantity,
                )}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex w-full items-center text-center">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 min-w-8 border border-solid border-muted-foreground"
                onClick={handleDecreaseProductQuantity}
              >
                <ChevronLeftIcon size={18} />
              </Button>
              <span className="block w-9 text-xs">{cartProduct.quantity}</span>
              <Button
                size="icon"
                className="h-8 w-8 min-w-8"
                onClick={handleIncreaseProductQuantity}
              >
                <ChevronRightIcon size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8 min-w-8 border border-solid border-muted-foreground"
        onClick={handleRemoveProductFromCart}
      >
        <TrashIcon size={18} />
      </Button>
    </div>
  );
};

export default CartItem;
