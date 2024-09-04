'use client';

import React from 'react';
import Link from 'next/link';

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import SearchBar from '@/components/SearchBar';
import { useSession, signIn, signOut } from 'next-auth/react';

function AvatarDropdownMenu() {

  // const { user, loading, logout } = useContext(UserContext);
  const { data: session } =  useSession();
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="h-full w-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.pn" />
            <AvatarFallback className="w-full h-full flex justify-center items-center border-gray-900 bg-gray-500/20 shadow-sm text-white rounded-xl hover:bg-gray-700/20">
              {session.user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white/90">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-300" />
        <DropdownMenuItem>
          <Link href="/board">Board</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/play-pile">Play Pile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

 function NavigationBar() {
  // const { user, loading, logout } = React.useContext(UserContext);
  const { data: session } = useSession();
  return (
    <>

    <div className="relative z-0 h-12 flex items-center justify-between px-4">
      <NavigationMenu className="w-full h-full">
        {/* Left side of the navigation bar */}
          <div className="flex items-center gap-x-3"></div>
        <NavigationMenuList className="flex items-center gap-x-3">
          <NavigationMenuItem key="playPile">
              <Link
                href="/play-pile"
                className="font-extrabold text-xl text-black/60 hover:text-black/30"
              >
                PlayPile
            </Link>
          </NavigationMenuItem>
          <div className="w-px h-8 opacity-90 bg-black rounded-sm"></div>
          <NavigationMenuItem key="board">
              <Link
                href="/board"
                className="font-medium text-lg text-black/60 hover:text-black/30"
              >
                Board
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>

        {/* Right side of the navigation bar */}
        <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-x-3">
          {session ? (
            <>
              <SearchBar />
              <AvatarDropdownMenu />
            </>
          ) : (
            <>

              <NavigationMenuItem key="login">
                <Link href="/sign-in" className="font-medium text-lg text-black/60 hover:text-black/30">
                  Sign In
                </Link>
              </NavigationMenuItem>
              {/* <div className="w-px h-8 opacity-90 bg-black rounded-sm"></div>
              <NavigationMenuItem key="register">
                <Link href="/register" className="font-medium text-lg text-black/60 hover:text-black/30">
                  Register
                </Link>
              </NavigationMenuItem> */}
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
      <div className="my-1 w-full h-0.5 bg-black/80 rounded-2xl opacity-30" />
      </>
  )

}

export default NavigationBar;
