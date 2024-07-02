'use client'

import NavbarUser from "@/components/TopNavbar/NavbarUser";
import Carousel from "@/components/Carousel/Carousel";
import { ReactTyped } from "react-typed";
import React from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardBody } from "@nextui-org/react";

export default function Home() {
  const [data, setData] = React.useState([]);
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "artikel"));
    const result = querySnapshot.docs.map((doc) => {
      return {
        key: doc.id,
        id: doc.data().id,
        tanggal: doc.data().tanggalPembuatan,
        judul: doc.data().judul,
        image: doc.data().image,
      };
    });
    setData(result);
  }

  React.useEffect(() => {

    fetchData();
  }
  , []);
  return (
    <>
      <NavbarUser/>
      <Carousel/>
      <div className="mt-3 flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center">
          {/* <ReactTyped strings={["Selamat Datang di Website"]} typeSpeed={80} className="text-4xl text-[#08997c] font-mono font-bold overflow-hidden"/>
          <ReactTyped strings={["Padukuhan Nujo"]} typeSpeed={80} className="text-3xl text-[#08997c] font-semibold font-mono overflow-hidden"/> */}
          <h1 className="text-4xl text-[#08997c] font-mono font-bold">Selamat Datang di Website</h1>
          <h1 className="text-3xl text-[#08997c] font-mono font-bold">Padukuhan Nujo</h1>
          <h1 className="text-2xl text-[#08997c] font-mono font-bold">Pucung, Kecamatan Girisubo, Kabupaten Gunung Kidul</h1>
          <h1 className="text-2xl text-[#08997c] font-mono font-bold">Daerah Istimewa Yogyakarta, Indonesia</h1>
        </div>
      </div>
      <div className="w-full flex justify-center mt-20">
        <div className="w-[1024px]">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-semibold font-mono">BERITA <strong>TERKINI</strong></h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div> 
          <div>
            <div>
              {data.map((item, index) => (
                <div key={index} className=" w-full h-full group bg-white rounded-lg mb-2 hover:shadow-lg ">
                  <div className="w-full h-64 bg-cover bg-center group-hover:rotate-2 transition-transform group-hover:scale-110" style={{backgroundImage: `url(${item.image})`}}></div>
                  <div className="p-4">
                    <h1 className="text-2xl font-semibold font-mono text-[#08997c]">{item.judul}</h1>
                    <p className="text-[#08997c] font-mono">{item.tanggal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
