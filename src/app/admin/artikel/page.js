"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
  Pagination,
  image,
} from "@nextui-org/react";
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { FaCirclePlus } from "react-icons/fa6";
import Link from "next/link";
import { db } from "../../../services/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import ModalHapus from "@/components/Modal/ModalHapus";
import withAuth from "@/components/Auth/CheckAuth";

const ArtikelPage = () => {
  const [page, setPage] = React.useState(1);
  const [rows, setRows] = React.useState([]);
  const rowsPerPage = 5;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  const fetchData = async () => {
    const q = query(collection(db, "artikel"));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        key: doc.id,
        id: data.id,
        tanggal: data.tanggalPembuatan, // Format tanggalPembuatan
        tanggalKegiatan: data.tanggalKegiatan, // Keep as string for sorting
        judul: data.judul,
        image: data.image,
        actions: (
          <div className="space-x-1 flex flex-wrap">
            <Button
              color="warning"
              as={Link}
              href={`/admin/artikel/ubah/${data.id}`}
            >
              Ubah
            </Button>
            <ModalHapus
              id={doc.id}
              reload={fetchData}
              linkImage={data.image}
            />
          </div>
        ),
      };
    });
  
    // Convert tanggalKegiatan to Date and sort
    result.sort((a, b) => {
      const dateA = new Date(a.tanggalKegiatan);
      const dateB = new Date(b.tanggalKegiatan);
      return dateB - dateA; // Sort in descending order
    });
  
    setRows(result);
  };
  

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-purple-500 overflow-hidden">
      <NavbarAdmin path={"artikel"} />
      <div className="w-screen mb-5 flex justify-center items-center content-center">
        <div className="w-screen max-w-[1024px] px-6 min-w-[420px]:px-6">
          <div className="my-2 flex justify-end">
            <Button
              color="primary"
              endContent={<FaCirclePlus />}
              as={Link}
              href="/admin/artikel/tambah"
            >
              Tambah
            </Button>
          </div>
          <Table
            bottomContent={
              <div className="flex justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
            aria-label="table data artikel"
          >
            <TableHeader>
              <TableColumn key="id">ID</TableColumn>
              <TableColumn key="judul">Judul</TableColumn>
              <TableColumn key="image">Gambar</TableColumn>
              <TableColumn key="tanggal">Tanggal Pembuatan</TableColumn>
              <TableColumn key="tanggalKegiatan">Tanggal Kegiatan</TableColumn>
              <TableColumn key="actions" width="200">
                Actions
              </TableColumn>
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={getKeyValue(item, "key")}>
                  <TableCell>{getKeyValue(item, "id")}</TableCell>
                  <TableCell>{getKeyValue(item, "judul")}</TableCell>
                  <TableCell>
                    <img
                      src={getKeyValue(item, "image")}
                      className="w-40 h-20 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell>{getKeyValue(item, "tanggal")}</TableCell>
                  <TableCell>{getKeyValue(item, "tanggalKegiatan")}</TableCell>
                  <TableCell>{getKeyValue(item, "actions")}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default withAuth(ArtikelPage);
