'use client'

import React, { useEffect } from "react";
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { db } from "../../../services/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import * as yup from "yup";
import { Button, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import withAuth from "@/components/Auth/CheckAuth";

const validationSchema = yup.object({
    sejarah: yup.string().required('Sejarah diperlukan'),
    tentang: yup.string().required('Tentang diperlukan'),
});

const ProfilePage = () => {
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
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        // Update document in Firestore
        const querySnapshot = await getDocs(collection(db, "profile"));
        querySnapshot.forEach(async (docSnapshot) => {
            const docRef = doc(db, "profile", docSnapshot.id);
            await updateDoc(docRef, {
                sejarah: values.sejarah,
                tentang: values.tentang,
            });
        });

        toast.success('Data berhasil diubah', {
          position: "top-right",
        });
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "profile"));
      querySnapshot.forEach((doc) => {
        formik.setFieldValue('sejarah', doc.data().sejarah);
        formik.setFieldValue('tentang', doc.data().tentang);
      });
    };
    fetchData();
  }, []);

  return (
      <div className="h-screen bg-gradient-to-br from-slate-100 to-purple-500 overflow-hidden">
          <NavbarAdmin path="profile"/>
          <div className="w-screen flex justify-center items-center content-center mt-5">
            <div className="w-screen max-w-[1024px] px-6 min-w-[420px]:px-6">
              <Card className="max-h-[580px]">
                <CardHeader>
                  <p className='text-medium font-semibold'>Profil Padukuhan</p>
                </CardHeader>
                <Divider />
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
                      <div className="grid">
                        <div className="h-48">
                          <label htmlFor="sejarah">Sejarah Padukuhan</label>
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
                          <label htmlFor="tentang">Tentang Padukuhan</label>
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
                        <Button className="mt-5" color="primary" onClick={formik.handleSubmit}>Simpan Perubahan</Button>
                      </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
      </div>
  );
};

export default withAuth(ProfilePage);
