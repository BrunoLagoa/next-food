import { useContext, useState } from "react";
import { CartContext } from "../_context/cart";
import CartItem from "./cart-item";
import { Card, CardContent } from "./ui/card";
import { formatCurrency } from "../_helpers/price";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { OrderStatus } from "@prisma/client";
import { createOrder } from "../_actions/order";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CartProps = {
  // eslint-disable-next-line no-unused-vars
  setIsOpen: (isOpen: boolean) => void;
};

const Cart = ({ setIsOpen }: CartProps) => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);

  const router = useRouter();
  const { data } = useSession();
  const { products, subTotalPrice, totalPrice, totalDiscount, clearCart } =
    useContext(CartContext);

  const handleFinishOrder = async () => {
    if (!data?.user) {
      return;
    }
    const restaurant = products[0].restaurant;

    try {
      setIsSubmitLoading(true);

      await createOrder({
        subTotalPrice,
        totalDiscounts: totalDiscount,
        totalPrice,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
        status: OrderStatus.PENDING,
        user: {
          connect: {
            id: data.user.id,
          },
        },
        products: {
          createMany: {
            data: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      clearCart();
      setIsOpen(false);

      toast("Pedido realizado com sucesso!", {
        description: "Aguarde a confirmação do restaurante.",
        action: {
          label: "Meus pedidos",
          onClick: () => {
            router.push("/my-orders");
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (!products.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h3 className="font-semibold">Sua sacola está vazia.</h3>
        <p className="text-xs">Adicione produtos para continuar.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-auto space-y-4">
        {products.map((product) => (
          <CartItem key={product.id} cartProduct={product} />
        ))}
      </div>

      <div>
        <Card className="mt-6">
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between text-xs">
              <span className=" text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subTotalPrice)}</span>
            </div>

            <Separator className="h-[0.5px]" />

            <div className="flex items-center justify-between text-xs">
              <span className=" text-muted-foreground">Desconto</span>
              <span>- {formatCurrency(totalDiscount)}</span>
            </div>

            <Separator className="h-[0.5px]" />

            <div className="flex items-center justify-between text-xs">
              <span className=" text-muted-foreground">Entrega</span>

              {Number(products[0].restaurant.deliveryFee) === 0 ? (
                <span className="uppercase text-primary">Grátis</span>
              ) : (
                <span>
                  {formatCurrency(Number(products[0].restaurant.deliveryFee))}
                </span>
              )}
            </div>

            <Separator className="h-[0.5px]" />

            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        className="mt-6 w-full"
        onClick={() => setIsConfirmationDialogOpen(true)}
        disabled={isSubmitLoading}
      >
        Finalizar pedido
      </Button>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realizar seu pedido agora?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ao finalizar, você não poderá mais alterar seu pedido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrder}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cart;
