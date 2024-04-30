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
  return (
    <div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>
              <UserCircleIcon className="px-3 py-2 text-gray-400 rounded-lg hover:bg-gray-700" />{' '}
              {/*//FIXME styling*/}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/playPileBoard">My Pile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <Link to="/">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NavigationBar() {

  const { user, loading, logout } = React.useContext(UserContext);

  return (
    <div as="header" className="bg-gray-800">
      {/* <div
        className="absolute
        top-0
        left-0
        w-full-96
        bg-gradient-to-br
        from-pink-400
        to-[#0055D1]
        rounded-md
        filter
        blur-3xl
        opacity-50
        -z-500"
      > */}


      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center px-2 lg:px-0">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <a
              href="/"
              className="rounded-md px-3 py-2 text-lg font-medium text-white"
            >
              Play Pile
            </a>
          </div>

          <div className="flex items-center justify-between">
            <NavigationMenu>
            <SearchBar />


              <NavigationMenuList>


                {user ? (
                  <>
                    <NavigationMenuItem key={'playPileBoard'}>
                    <Link
                      to={'/playPileBoard'}
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {'My PlayPile'}
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem key={'avatar'}>
                    <AvatarDropdownMenu></AvatarDropdownMenu>
                  </NavigationMenuItem>
                  </>
                ) : (
                  <>
                    <NavigationMenuItem key={'register'}>
                      <Link
                        to={'/register'}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {'Sign Up'}

                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem key={'login'}>
                      <Link
                        to={'/login'}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {'Login'}
                      </Link>
                    </NavigationMenuItem>

                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      {/* </div> */}
      </div>
    </div>
  );
}

export default NavigationBar;
