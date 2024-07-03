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
import { collection, getDocs } from "firebase/firestore";
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
    const querySnapshot = await getDocs(collection(db, "artikel"));
    const result = querySnapshot.docs.map((doc) => {
      return {
        key: doc.id,
        id: doc.data().id,
        tanggal: doc.data().tanggalPembuatan,
        judul: doc.data().judul,
        image: doc.data().image,
        actions: (
          <div className="space-x-1">
            <Button
              color="warning"
              as={Link}
              href={`/admin/artikel/ubah/${doc.data().id}`}
            >
              Ubah
            </Button>
            <ModalHapus
              id={doc.id}
              reload={fetchData}
              linkImage={doc.data().image}
            />
          </div>
        ),
      };
    });
    setRows(result);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 to-purple-500">
      <NavbarAdmin path={"artikel"} />
      <div className="w-screen flex justify-center items-center content-center">
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
                  {/* <TableCell  className="max-w-52 w-auto text-ellipsis overflow-hidden">
                                    <div dangerouslySetInnerHTML={{ __html:getKeyValue(item, 'content') }}/>
                                  </TableCell> */}
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
