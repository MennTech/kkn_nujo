'use client'

import NavbarUser from "@/components/TopNavbar/NavbarUser";
import Carousel from "@/components/Carousel/Carousel";
import { ReactTyped } from "react-typed";
import React from "react";

export default function Home() {
  const typeRef = React.useRef(null);

  const handleComplete = () => {
    if(typeRef.current) {
      typeRef.current.classList.add('hide-cursor');
    }
  }
  return (
    <>
      <NavbarUser/>
      <Carousel/>
      <div className="w-full mt-3">
        <div className="w-full flex flex-col justify-center items-center">
          <ReactTyped strings={["Selamat Datang di Website",]} typeSpeed={80} backSpeed={80} loop className="text-4xl text-[#08997c] font-mono font-bold"/>
          <h1>Padukuhan Nujo</h1>
          <h1>Pucung, Kecamatan Girisubo, Kabupaten Gunung Kidul</h1>
          <h1>Daerah Istimewa Yogyakarta, Indonesia</h1>
        </div>
        <div>

        </div>
      </div>
    </>
  );
}
