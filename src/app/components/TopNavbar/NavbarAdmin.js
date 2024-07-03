'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, Divider } from '@nextui-org/react';
import { signOut } from 'firebase/auth';
import { auth } from '../../../services/firebase';

const NavbarAdmin = ({path}) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const router = useRouter();
    const menuItems = [
        "Profile",
        "Artike;",
        "Logout",
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/admin')
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <>
      <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">NUJO</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive = {path == 'profile' ? true : false}>
          <Link color="foreground" href="/admin/profile">
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem isActive = {path == 'artikel' ? true : false}>
          <Link color="foreground" href="/admin/artikel">
            Artikel
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button color='danger' onClick={handleLogout}>
            Logout
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === menuItems.length - 1 ? "danger": "foreground" 
              }
              className="w-full"
              href={`/admin/${item.toLowerCase()}`}
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

export default NavbarAdmin;