"use client";

import NavbarUser from "@/components/TopNavbar/NavbarUser";
import Carousel from "@/components/Carousel/Carousel";
import { ReactTyped } from "react-typed";
import React from "react";
import { db } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "@nextui-org/react";
import { IoMdArrowDropright } from "react-icons/io";
import FooterUser from "@/components/Footer/footer";

export default function Home() {
  const [data, setData] = React.useState([]);
  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "artikel"));
    const result = querySnapshot.docs.map((doc) => {
      return {
        key: doc.id,
        id: doc.data().id,
        tanggalKegiatan: doc.data().tanggalKegiatan,
        tanggalPembuatan: new Date(doc.data().tanggalPembuatan),
        judul: doc.data().judul,
        image: doc.data().image,
        isi: doc.data().content,
      };
    });
    const sortedResult = result
      .sort((a, b) => b.tanggalPembuatan - a.tanggalPembuatan)
      .slice(0, 3);
    setData(sortedResult);
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <NavbarUser />
      <Carousel />
      <div className="mt-5 flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center px-2 text-center">
          <h1 className="text-lg md:text-xl text-[#08997c] font-mono font-bold">
            Selamat Datang di Website
          </h1>
          <h1 className="text-2xl md:text-3xl text-[#08997c] font-mono font-bold">
            Padukuhan Nujo
          </h1>
          <h1 className="text-lg md:text-xl text-[#08997c] font-mono font-bold">
            Pucung, Kecamatan Girisubo, Kabupaten Gunung Kidul, Daerah Istimewa
            Yogyakarta, Indonesia
          </h1>
        </div>
      </div>
      <div className="w-full flex justify-center mt-20">
        <div className="w-[1024px] mx-3">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-semibold font-mono">
              BERITA <strong>TERKINI</strong>
            </h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div>
          <div>
            {data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.map((item, index) => (
                  <Link href={`/berita/${item.id}`} key={index}>
                    <div className="w-full h-full bg-white rounded-lg mb-2 hover:shadow-lg group overflow-hidden">
                      <div
                        className="w-full h-64 bg-cover bg-center rounded group-hover:scale-110 ease-in duration-200"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <div className="p-4">
                        <p className="text-[#08997c] font-mono text-sm">
                          {item.tanggalKegiatan}
                        </p>
                        <p className="text-lg font-bold font-mono text-[#08997c] text-ellipsis line-clamp-2">
                          {item.judul}
                        </p>
                        <div
                          className="text-ellipsis line-clamp-3 text-black"
                          dangerouslySetInnerHTML={{ __html: item.isi }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-full bg-white rounded-lg mb-2 animate-pulse overflow-hidden"
                  >
                    <div className="w-full h-64 bg-gray-300 rounded"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Link
                href="/berita"
                className="text-[#08997c] font-mono font-semibold"
              >
                Lihat Berita Lainnya <IoMdArrowDropright/>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <FooterUser />
    </>
  );
}
