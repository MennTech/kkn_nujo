'use client'

import React, { useEffect } from "react";
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { db } from "../../../services/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Card, CardHeader, CardBody, Divider, Input } from "@nextui-org/react";
import withAuth from "@/components/Auth/CheckAuth";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function ProfilePage() {

  const validationSchema = yup.object({
      sejarah: yup.string().required('Sejarah diperlukan'),
      tentang: yup.string().required('Tentang diperlukan'),
      rt: yup.string().required('RT diperlukan'),
      rw: yup.string().required('RW diperlukan'),
      jumlahPenduduk: yup.string().required('Jumlah Penduduk diperlukan'),
  });

  const modules = {
    toolbar: [
        [{ font: [] }],
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        ['link'],
    ],
  };

  const formik = useFormik({
    initialValues: {
        sejarah: '',
        tentang: '',
        rt: '',
        rw: '',
        jumlahPenduduk: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        // Update document in Firestore
        const querySnapshot = await getDocs(collection(db, "profile"));
        querySnapshot.forEach(async (docSnapshot) => {
            const docRef = doc(db, "profile", docSnapshot.id);
            await updateDoc(docRef, {
                sejarah: values.sejarah,
                tentang: values.tentang,
                rt: values.rt,
                rw: values.rw,
                jumlahPenduduk: values.jumlahPenduduk,
            });
        });

        toast.success('Data berhasil diubah', {
          position: "top-right",
        });
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = (await getDocs(collection(db, "profile"))).docs[0];
      formik.setFieldValue('sejarah', querySnapshot.data().sejarah);
      formik.setFieldValue('tentang', querySnapshot.data().tentang);
      formik.setFieldValue('rt', querySnapshot.data().rt);
      formik.setFieldValue('rw', querySnapshot.data().rw);
      formik.setFieldValue('jumlahPenduduk', querySnapshot.data().jumlahPenduduk);
    };
    fetchData();
  }, []);

  return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-purple-500 overflow-hidden">
          <NavbarAdmin path="profile"/>
          <div className="h-full py-10">
            <div className="flex justify-center items-center">
              <div className="w-full mt-4 max-w-[1024px] px-6 min-w-[420px]:px-6">
                  <Card className="flex flex-col gap-y-2">
                    <CardHeader>
                      <p className='text-medium font-semibold'>Profil Padukuhan</p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <form onSubmit={formik.handleSubmit}>
                          <div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:grid-cols-3 sm:grid-cols-3">
                              <div className="col-span-1">
                                <Input
                                  type="number"
                                  id="rt"
                                  name="rt"
                                  value={formik.values.rt}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  label="RT"
                                  labelPlacement="outside"
                                  placeholder="Masukkan Jumlah RT"
                                  isRequired
                                />
                                {formik.errors.rt && formik.touched.rt && (
                                  <div className="text-red-500">{formik.errors.rt}</div>
                                )}
                              </div>
                              <div className="col-span-1">
                                <Input
                                  type="number"
                                  id="rw"
                                  name="rw"
                                  value={formik.values.rw}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  label="RW"
                                  labelPlacement="outside"
                                  placeholder="Masukkan Jumlah RW"
                                  isRequired
                                />
                                {formik.errors.rw && formik.touched.rw && (
                                  <div className="text-red-500 text-sm">{formik.errors.rw}</div>
                                )}
                              </div>
                              <div className="col-span-1">
                                <Input
                                  type="number"
                                  id="jumlahPenduduk"
                                  name="jumlahPenduduk"
                                  value={formik.values.jumlahPenduduk}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  label="Jumlah Penduduk"
                                  labelPlacement="outside"
                                  placeholder="Masukkan Jumlah Penduduk"
                                  isRequired
                                />
                                {formik.errors.jumlahPenduduk && formik.touched.jumlahPenduduk && (
                                  <div className="text-red-500 text-sm">{formik.errors.jumlahPenduduk}</div>
                                )}
                              </div>
                            </div>
                            <div className="h-48 mt-5">
                              <label htmlFor="sejarah" className="text-sm">Sejarah Padukuhan <span className="text-red-500">*</span></label>
                              <ReactQuill
                                theme="snow"
                                id="sejarah"
                                modules={modules}
                                value={formik.values.sejarah}
                                onChange={(value) => formik.setFieldValue('sejarah', value)}
                                placeholder="Sejarah"
                                className="h-[50%] sm:h-[70%]"
                              />
                              {formik.errors.sejarah && formik.touched.sejarah && (
                                <div className="text-red-500">{formik.errors.sejarah}</div>
                              )}
                            </div>
                            <div className="h-48 mt-5">
                              <label htmlFor="tentang" className="text-sm">Tentang Padukuhan <span className="text-red-500">*</span></label>
                              <ReactQuill
                                theme="snow"
                                id="tentang"
                                modules={modules}
                                value={formik.values.tentang}
                                onChange={(value) => formik.setFieldValue('tentang', value)}
                                placeholder="Tentang"
                                className="h-[50%] sm:h-[70%]"
                              />
                              {formik.errors.tentang && formik.touched.tentang && (
                                <div className="text-red-500">{formik.errors.tentang}</div>
                              )}
                            </div>
                            <div className="w-full mt-5">
                              <Button className="w-full" color="primary" onClick={formik.handleSubmit}>Simpan Perubahan</Button>
                            </div>
                          </div>
                      </form>
                    </CardBody>
                  </Card>
              </div>
            </div>
          </div>
      </div>
  );
};

export default withAuth(ProfilePage);
