"use client";

import Cart from "@/app/_components/cart";
import { Button } from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { CartContext } from "@/app/_context/cart";
import { formatCurrency } from "@/app/_helpers/price";
import { Restaurant } from "@prisma/client";
import { useContext } from "react";

type CartBannerProps = {
  restaurant: Pick<Restaurant, "id">;
};

const CartBanner = ({ restaurant: { id } }: CartBannerProps) => {
  const { products, totalPrice, totalQuantity } = useContext(CartContext);

  const restaurantHasProductsOnCart = products.some(
    (product) => product.restaurantId === id,
  );

  if (!restaurantHasProductsOnCart) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-solid border-muted bg-white p-5 pt-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total sem entrega</p>
          <p className="font-semibold">
            {formatCurrency(totalPrice)}
            <span className="text-xs font-normal text-muted-foreground">
              {" "}
              / {totalQuantity} {totalQuantity > 1 ? "itens" : "item"}
            </span>
          </p>
        </div>

        <Sheet>
          <SheetTrigger>
            <Button>Ver sacola</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-left">Minha sacola</SheetTitle>
            </SheetHeader>
            <SheetDescription className="h-full py-5">
              <Cart />
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CartBanner;
