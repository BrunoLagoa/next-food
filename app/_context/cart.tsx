/* eslint-disable no-unused-vars */
"use client";

import { ReactNode, createContext, useState } from "react";
import { Prisma } from "@prisma/client";
import { calculateProductTotalPrice } from "../_helpers/price";

type CartProductPrisma = Prisma.ProductGetPayload<{
  include: {
    restaurant: {
      select: {
        id: true;
        deliveryFee: true;
        deliveryTimeMinutes: true;
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
  totalQuantity: number;
  addProductToCart: ({
    product,
    quantity,
    emptyCart,
  }: AddProductToCart) => void;
  decreaseProductQuantity: (productId: string) => void;
  increaseProductQuantity: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
  clearCart: () => void;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartContext = createContext<CartContextType>({
  products: [],
  subTotalPrice: 0,
  totalPrice: 0,
  totalDiscount: 0,
  totalQuantity: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: CartProviderProps) => {
  const [products, setProducts] = useState<CartProduct[]>([]);

  const subTotalPrice = products.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity;
  }, 0);

  const totalPrice =
    products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity;
    }, 0) + Number(products[0]?.restaurant.deliveryFee);

  const totalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);

  const totalDiscount =
    subTotalPrice - totalPrice + Number(products[0]?.restaurant.deliveryFee);

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

  const clearCart = () => {
    return setProducts([]);
  };

  return (
    <CartContext.Provider
      value={{
        products,
        subTotalPrice,
        totalPrice,
        totalDiscount,
        totalQuantity,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
