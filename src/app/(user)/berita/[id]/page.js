"use client";

import FooterUser from "@/components/Footer/footer";
import NavbarUser from "@/components/TopNavbar/NavbarUser";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../services/firebase";
import { Image, Link } from "@nextui-org/react";
import { FaHome } from "react-icons/fa";

const DetailBerita = ({ params }) => {
  const id = params.id;
  const [data, setData] = useState({});

  const fetchData = async () => {
    const q = query(collection(db, "artikel"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const result = doc.data();
      setData(result);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavbarUser />
      <div className="h-full max-w-5xl w-full mx-auto my-5">
        <nav className="mx-6 p-2 rounded mb-2">
          <ol className="flex space-x-1">
            <li className="flex justify-center items-center font-bold text-medium">
              <Link href="/" className="text-[#08997c] gap-1">
                <FaHome />
                Home<span>/</span>
              </Link>
            </li>
            <li className="flex justify-center items-center font-bold text-medium">
              <Link href="/berita" className="text-[#08997c] gap-1">
                Berita<span>/</span>
              </Link>
            </li>
            <li className="text-[#08997c] font-bold text-medium">
              Detail Berita
            </li>
          </ol>
        </nav>
        {data ? (
          <div className="mx-6 flex flex-col gap-1 items-center">
            <p className="text-3xl text-green-700 font-semibold text-center">
              {data.judul}
            </p>
            <p className="text-center text-sm font-light">
              {new Date(data.tanggalKegiatan).toLocaleString("id-ID", {dateStyle:'full'})}
            </p>
            <Image
              src={data.image}
              className="w-screen aspect-[16/10] sm:aspect-[16/6] rounded-xl mt-3 object-cover"
            />
            <div
              dangerouslySetInnerHTML={{ __html: data.content }}
              className="mt-3 text-justify"
            />
          </div>
        ) : (
          <div className="mx-6 flex flex-col gap-1 items-center animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
            <div className="w-screen aspect-[16/10] sm:aspect-[16/6] bg-gray-300 rounded-xl mt-3"></div>
            <div className="mt-3 space-y-4 w-full">
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        )}
      </div>

      <FooterUser />
    </>
  );
};

export default DetailBerita;
