'use client'

import NavbarUser from "@/components/TopNavbar/NavbarUser";
import Carousel from "@/components/Carousel/Carousel";
import { ReactTyped } from "react-typed";
import React from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

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
      <div className="w-full mt-3">
        <div className="w-full flex flex-col justify-center items-center">
          <ReactTyped strings={["Selamat Datang di Website"]} typeSpeed={80} className="text-4xl text-[#08997c] font-mono font-bold"/>
          <ReactTyped strings={["Padukuhan Nujo"]} typeSpeed={80} className="text-3xl text-[#08997c] font-semibold font-mono"/>
          <h1>Pucung, Kecamatan Girisubo, Kabupaten Gunung Kidul</h1>
          <h1>Daerah Istimewa Yogyakarta, Indonesia</h1>
        </div>
        <h1>asdauybcsjbusvbsyvbb</h1>
        <div>
          <h1 className="text-2xl text-[#08997c] font-semibold font-mono">Artikel Terbaru</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item, index) => (
              <div key={index} className="w-full h-full bg-white rounded-lg shadow-lg">
                <img src={item.image} alt={`artikel-${index}`} className="object-cover w-full h-52 rounded-t-lg"/>
                <div className="p-4">
                  <h1 className="text-xl font-semibold">{item.judul}</h1>
                  <p className="text-sm text-gray-500">{item.tanggal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
