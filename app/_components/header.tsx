"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import {
  HeartIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "./ui/separator";

const Header = () => {
  const { data, status } = useSession();

  const handleSignIn = () => {
    signIn();
  };

  const handleSignOut = () => {
    signOut();
  };

  const isAuthenticating = status === "authenticated";

  return (
    <div className="flex justify-between px-5 pt-6">
      <div className="relative h-[26px] w-[150px]">
        <Link href="/">
          <Image src="/logo.png" alt="Foods" fill className="object-cover" />
        </Link>
      </div>

      <Sheet>
        <SheetTrigger>
          <Button
            size="icon"
            variant="outline"
            className="border-none bg-transparent"
          >
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>

            {isAuthenticating && (
              <div className="flex justify-between pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={data?.user?.image as string | undefined}
                    />
                    <AvatarFallback>
                      {data.user?.name?.split(" ")[0]?.[0]}
                      {data.user?.name?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-left font-semibold">
                      {data.user?.name}
                    </h3>
                    <span className="block text-xs text-muted-foreground">
                      {data.user?.email}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!isAuthenticating && (
              <div className=" flex items-center justify-between pt-6">
                <h2 className="font-semibold">Faça seu login</h2>
                <Button onClick={handleSignIn} className="space-x-2">
                  <LogInIcon />
                  <span className="block">Login</span>
                </Button>
              </div>
            )}

            <div className="py-6">
              <Separator />
            </div>

            <div className="space-y-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                >
                  <HomeIcon size={16} />
                  <span className="block">Início</span>
                </Button>
              </Link>

              {isAuthenticating && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                    asChild
                  >
                    <Link href="/my-orders">
                      <ScrollTextIcon size={16} />
                      <span className="block">Meus pedidos</span>
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                  >
                    <HeartIcon size={16} />
                    <span className="block">Restaurantes favoritos</span>
                  </Button>
                </>
              )}
            </div>

            {isAuthenticating && (
              <>
                <div className="py-6">
                  <Separator />
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-3 rounded-full text-sm font-normal"
                  onClick={handleSignOut}
                >
                  <LogOutIcon size={16} />
                  <span className="block">Sair da conta</span>
                </Button>
              </>
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
