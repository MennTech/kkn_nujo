"use client";

import FooterUser from "@/components/Footer/footer";
import NavbarUser from "@/components/TopNavbar/NavbarUser";
import { FaHome } from "react-icons/fa";
import { Link, Card, CardBody } from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const Counter = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2 });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};

const Profile = () => {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "profile"));
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const result = {
          key: doc.id,
          rt: doc.data().rt,
          rw: doc.data().rw,
          jumlahPenduduk: doc.data().jumlahPenduduk,
          tentang: doc.data().tentang,
          sejarah: doc.data().sejarah,
        };
        setData(result);
      } else {
        console.log("No documents found in the collection");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavbarUser />
      <div className="h-full max-w-5xl w-full mx-auto my-5">
        <nav className="mx-6 p-2 rounded">
          <ol className="flex space-x-1">
            <li className="flex justify-center items-center font-bold text-medium">
              <Link href="/" className="text-[#08997c] gap-1">
                <FaHome />
                Home<span>/</span>
              </Link>
            </li>
            <li className="text-[#08997c] font-bold text-medium">Profile</li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-6 mt-2">
          <Card className="bg-[#f0fdf4]">
            <CardBody className="flex justify-center items-center">
              <div className="text-3xl font-extrabold text-[#08997c]">
                <Counter value={data.rt || 0} />
              </div>
              <div className="font-medium text-lg text-gray-500">Jumlah RT</div>
            </CardBody>
          </Card>
          <Card className="bg-[#f0fdf4]">
            <CardBody className="flex justify-center items-center">
              <div className="text-3xl font-extrabold text-[#08997c]">
                <Counter value={data.rw || 0} />
              </div>
              <div className="font-medium text-lg text-gray-500">Jumlah RW</div>
            </CardBody>
          </Card>
          <Card className="bg-[#f0fdf4]">
            <CardBody className="flex justify-center items-center">
              <div className="text-3xl font-extrabold text-[#08997c]">
                <Counter value={data.jumlahPenduduk || 0} />
              </div>
              <div className="font-medium text-lg text-gray-500">
                Jumlah Penduduk
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="mx-6 mt-5">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-mono">
              SEJARAH <strong>PADUKUHAN</strong>
            </h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div>
          {data.sejarah ? (
            <div
              className="p-profil text-justify text-lg font-mono"
              dangerouslySetInnerHTML={{ __html: data.sejarah }}
            />
          ) : (
            <div className="p-profil text-justify text-lg font-mono">
              <div className="animate-pulse">
                <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-green-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-green-200 rounded w-2/3"></div>
              </div>
            </div>
          )}
        </div>

        <div className="mx-6 mt-5">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-mono">
              TENTANG <strong>PADUKUHAN</strong>
            </h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div>
          {data.tentang ? (
            <div
              className="p-profil text-justify text-lg font-mono"
              dangerouslySetInnerHTML={{ __html: data.tentang }}
            />
          ) : (
            <div className="p-profil text-justify text-lg font-mono">
              <div className="animate-pulse">
                <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-green-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-green-200 rounded w-2/3"></div>
              </div>
            </div>
          )}
        </div>

        <div className="mx-6 mt-5">
          <div className="border-b border-b-green-300 mb-6">
            <h1 className="text-3xl text-[#08997c] font-mono">
              STRUKTUR <strong>ORGANISASI</strong>
            </h1>
            <div className="bg-green-600 h-1 w-32"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-green-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-green-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      <FooterUser />
    </>
  );
};

export default Profile;
