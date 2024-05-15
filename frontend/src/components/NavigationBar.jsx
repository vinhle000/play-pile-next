import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
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
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import SearchBar  from '@/components/SearchBar';
import  UserContext  from '../contexts/UserContext';

//TODO: implement userLoggedIn state after logging in
  //useContext to get userLoggedIn state

function AvatarDropdownMenu() {
  const { user, loading, logout } = useContext(UserContext);
  console.log(user)
  return (

      <DropdownMenu>
        <DropdownMenuTrigger>
            <div className="h-full w-full">
          <Avatar>

            <AvatarImage src="https://github.com/shadcn.pn" />
            <AvatarFallback className="w-full h-full flex justify-center items-center  bg-gray-100/20 shadow-sm
               text-white  rounded-xl hover:bg-gray-700/20 " >
                {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white/90">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-300"/>
          <DropdownMenuItem>
            <Link to="/board">Board</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/playPileBoard">Play Pile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <Link to="/">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}

function NavigationBar() {

  const { user, loading, logout } = React.useContext(UserContext);

  return (
    <>

    <div className="h-12 flex items-center justify-between px-4">
      <NavigationMenu className="w-full h-full">
        {/* Left side of the navigation bar */}
        <div className="flex items-center gap-x-3">
        </div>
        <NavigationMenuList className="flex items-center gap-x-3">
          <NavigationMenuItem key="playPile">
            <Link to="/playPile" className="font-extrabold text-xl text-black/60 hover:text-black/30">
              PlayPile
            </Link>
          </NavigationMenuItem>
          <div className="w-px h-8 opacity-90 bg-black rounded-sm"></div>
          <NavigationMenuItem key="board">
            <Link to="/board" className="font-medium text-lg text-black/60 hover:text-black/30">
              Board
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>

        {/* Right side of the navigation bar */}
        <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-x-3">
          {user ? (
            <>
              <SearchBar />
              <AvatarDropdownMenu />
            </>
          ) : (
            <>

              <NavigationMenuItem key="login">
                <Link to="/login" className="font-medium text-lg text-black/60 hover:text-black/30">
                  Login
                </Link>
              </NavigationMenuItem>
              <div className="w-px h-8 opacity-90 bg-black rounded-sm"></div>
              <NavigationMenuItem key="register">
                <Link to="/register" className="font-medium text-lg text-black/60 hover:text-black/30">
                  Register
                </Link>
              </NavigationMenuItem>
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
