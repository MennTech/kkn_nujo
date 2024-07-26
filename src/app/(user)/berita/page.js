"use client";

import FooterUser from "@/components/Footer/footer";
import NavbarUser from "@/components/TopNavbar/NavbarUser";
import { FaHome, FaSearch } from "react-icons/fa";
import { Link, Card, CardBody, Input, Button } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useRouter } from "next/navigation";

export default function Berita() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchData = async () => {
    const q = query(collection(db, "artikel"));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => {
      return {
        key: doc.id,
        id: doc.data().id,
        tanggalKegiatan: doc.data().tanggalKegiatan,
        judul: doc.data().judul,
        isi: doc.data().content,
        image: doc.data().image,
      };
    });

    // Sort the result by tanggalKegiatan
    result.sort((a, b) => {
      const dateA = new Date(a.tanggalKegiatan);
      const dateB = new Date(b.tanggalKegiatan);
      return dateB - dateA; // Sort in descending order
    });

    // Set the sorted data
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    item.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReadMore = (id) => {
    router.push(`/berita/${id}`);
  };

  return (
    <>
      <NavbarUser />
      <div className="h-full max-w-5xl w-full mx-auto my-5">
        <div className="mx-6">
          <nav className="p-2 rounded flex justify-between gap-4 pr-0">
            <ol className="flex space-x-1">
              <li className="flex justify-center items-center font-bold text-medium">
                <Link href="/" className="text-[#08997c] gap-1">
                  <FaHome />
                  Home<span>/</span>
                </Link>
              </li>
              <li className="text-[#08997c] font-bold text-medium flex justify-center items-center">
                Berita
              </li>
            </ol>
            <Input
              type="text"
              className="items-end w-1/2 sm:w-1/3"
              startContent={<FaSearch />}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </nav>
        </div>
        <div className="mx-6">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-bold font-mono">
              BERITA
            </h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.key}>
                <Card className="my-4 md:my-2 group overflow-hidden">
                  <CardBody className="w-full p-0 h-full md:h-40 group-hover:bg-slate-200">
                    <div className="flex flex-col md:flex-row w-full md:justify-between overflow-hidden">
                      <div className="w-full md:w-1/4">
                        <img
                          src={item.image}
                          alt="gambar"
                          className="w-full h-40 object-cover rounded-xl group-hover:scale-110 ease-in transition-transform duration-200"
                        />
                      </div>
                      <div className="w-full md:w-1/2 px-4 py-2 overflow-hidden">
                        <h1 className="text-xl font-bold">{item.judul}</h1>
                        <p className="text-sm text-gray-500">
                          {new Date(item.tanggalKegiatan).toLocaleString("id-ID", {dateStyle:'full'})}
                        </p>
                        <div
                          className="text-ellipsis line-clamp-2 mt-1 text-sm "
                          dangerouslySetInnerHTML={{ __html: item.isi }}
                        />
                      </div>
                      <div className="w-full md:w-1/4 p-2 md:p-4 flex justify-end items-end">
                        <Button
                          onClick={() => handleReadMore(item.id)}
                          className="mt-0 md:mt-2 bg-[#08997c] text-white font-semibold"
                        >
                          Baca selengkapnya
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))
          ) : searchTerm ? (
            <div className="text-center text-gray-500">Berita Tidak Ditemukan.</div>
          ) : (
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="my-4 md:my-2 group overflow-hidden animate-pulse"
              >
                <div className="w-full p-0 h-full md:h-40 bg-white">
                  <div className="flex flex-col md:flex-row w-full md:justify-between overflow-hidden">
                    <div className="w-full md:w-1/4 bg-gray-300 h-40 rounded-xl"></div>
                    <div className="w-full md:w-1/2 px-4 py-2">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
                    </div>
                    <div className="w-full md:w-1/4 p-2 md:p-4 flex justify-end items-end">
                      <div className="h-10 bg-gray-300 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <FooterUser />
    </>
  );
}
