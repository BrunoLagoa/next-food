/* eslint-disable no-unused-vars */
"use client";

import { ReactNode, createContext, useMemo, useState } from "react";
import { Prisma, Product } from "@prisma/client";
import { calculateProductTotalPrice } from "../_helpers/price";

type CartProductPrisma = Prisma.ProductGetPayload<{
  include: {
    restaurant: {
      select: {
        deliveryFee: true;
      };
    };
  };
}>;

export type CartProduct = CartProductPrisma & {
  quantity: number;
};

type AddProductToCart = {
  product: CartProductPrisma;
  quantity: number;
  emptyCart?: boolean;
};

type CartContextType = {
  products: CartProduct[];
  subTotalPrice: number;
  totalPrice: number;
  totalDiscount: number;
  addProductToCart: ({
    product,
    quantity,
    emptyCart,
  }: AddProductToCart) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartContext = createContext<CartContextType>({
  products: [],
  subTotalPrice: 0,
  totalPrice: 0,
  totalDiscount: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
});

export const CartProvider = ({ children }: CartProviderProps) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subTotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);

  const totalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0);
  }, [products]);

  const totalDiscount = subTotalPrice - totalPrice;

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct;
          }
          return { ...cartProduct, quantity: cartProduct.quantity - 1 };
        }
        return cartProduct;
      }),
    );
  };

  const increaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return { ...cartProduct, quantity: cartProduct.quantity + 1 };
        }
        return cartProduct;
      }),
    );
  };

  const removeProductFromCart = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((cartProduct) => cartProduct.id !== productId),
    );
  };

  const addProductToCart = ({
    product,
    quantity,
    emptyCart,
  }: AddProductToCart) => {
    if (emptyCart) {
      setProducts([]);
    }

    const isProductInCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    );

    if (isProductInCart) {
      return setProducts((prevProducts) =>
        prevProducts.map((cartProduct) =>
          cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
            : cartProduct,
        ),
      );
    }

    setProducts((prevProducts) => [...prevProducts, { ...product, quantity }]);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subTotalPrice,
        totalPrice,
        totalDiscount,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
