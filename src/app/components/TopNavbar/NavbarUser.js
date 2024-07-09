'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Divider } from '@nextui-org/react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebase';

const NavbarUser = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const router = useRouter();
    const menuItems = [
        "Artikel",
        "Profile"
    ];

    return(
        <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href='/' className="font-bold text-inherit text-[#08997c]">NUJO</Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem isActive>
          <Link href="#" className='text-[#08997c]'>
            Artikel
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" className='text-[#08997c]'>
            Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className='w-full font-semibold text-[#08997c]'
              href={`/${item.toLowerCase()}`}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
    <Divider/>
    </>
    );
}

export default NavbarUser;