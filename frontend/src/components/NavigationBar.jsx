import React from 'react';
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

const userLoggedIn = true;
function AvatarDropdownMenu() {
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
            <Link to="/backlog">Backlog</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log('logging')}>
            <Link to="/">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NavigationBar() {
  return (
    <div as="header" className="bg-gray-800">
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
              <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                <div className="w-full max-w-lg lg:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Search"
                      type="search"
                    />
                  </div>
                </div>
              </div>

              <NavigationMenuList>
                <NavigationMenuItem key={'backlog'}>
                  <NavigationMenuLink
                    as={Link}
                    to={'/backlog'}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {'Backlog'}
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {userLoggedIn ? (
                  <NavigationMenuItem key={'profile'}>
                    <AvatarDropdownMenu></AvatarDropdownMenu>
                  </NavigationMenuItem>
                ) : (
                  <>
                    <NavigationMenuItem key={'login'}>
                      <NavigationMenuLink
                        as={Link}
                        to={'/login'}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {'Login'}
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem key={'register'}>
                      <NavigationMenuLink
                        as={Link}
                        to={'/register'}
                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                      >
                        {'Sign Up'}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
