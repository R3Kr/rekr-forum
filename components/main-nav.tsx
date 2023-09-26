"use client";
import Link from "next/link";
import Image from "next/image";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav>
      <div className="bg-[url('/forum.svg')] bg-no-repeat bg-[length:480px_360px] h-28  bg-blue-700"></div>
      <div className="px-56">
      <NavigationMenu className="bg-red-700">
        <NavigationMenuList className="">
          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Link</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>AWD</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Knulla</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Din</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Mamma</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem >
            <Link href={"/"} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Nu</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
      </div>
    </nav>
  );
}
