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
            <Link to="/profile">Board</Link>
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
      <NavigationMenu className="w-full h-12 ">

        <div className="w-full h-full flex items-center space-x-72">

            {/*left side */}
            <div className="">
              <NavigationMenuList className={`flex flex-shrink-0 items-center justify-center gap-x-3 leading-[normal] `}>


                <div className="w-px h-8 opacity-10 bg-black rounded-sm"></div>
                <NavigationMenuItem key={'playPile'}>
                <Link
                    to={'/playPile'}
                    className="w-14 h-6 font-extrabold text-black/60 hover:text-white/60"
                  >
                    {'PlayPile'}
                  </Link>
                </NavigationMenuItem>

                <div className="w-px h-8 opacity-10 bg-black rounded-sm"></div>
                <NavigationMenuItem key={'board'}>
                <Link
                    to={'/board'}
                    className="w-14 h-6 font-medium text-black/60 hover:text-white/60"
                  >
                      <div>Board</div>
                  </Link>
                </NavigationMenuItem>


              </NavigationMenuList>
           </div>



      {/*right side */}

      <div className="">
      <NavigationMenuList className="flex items-center justify-center self-stretch">
        {user
        ? (
            <>
              <SearchBar />
              <AvatarDropdownMenu/>
            </>
          )
        : (
          <>
            <div className="w-px h-8 opacity-10 bg-black rounded-sm" />
            <NavigationMenuItem key={'board'}>
            <Link
                to={'/login'}
                className="flex w-14 flex-shrink-0 flex-col font-medium text-black/30"
              >
                 Login
              </Link>
            </NavigationMenuItem>


            <div className="w-px h-8 opacity-10 bg-black rounded-sm" />
            <NavigationMenuItem key={'register'}>
            <Link
                to={'/register'}
                className="flex w-14 flex-shrink-0 flex-col font-medium text-black/30"
              >
                Register
              </Link>
            </NavigationMenuItem>
          </>
        )}

      </NavigationMenuList>
      </div>

      </div>
      </NavigationMenu>
      <div className="w-full h-0.5 opacity-10 bg-black" />
    </>
  )

}

export default NavigationBar;
