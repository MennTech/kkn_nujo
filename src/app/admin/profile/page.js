'use client'

import React, { useEffect } from "react";
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { db } from "../../../services/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Card, CardHeader, CardBody, Divider, Input, Image } from "@nextui-org/react";
import withAuth from "@/components/Auth/CheckAuth";
import 'react-quill/dist/quill.snow.css';
import dynamic from "next/dynamic";
import { getFile, uploadFile } from "@/libs/storage";
import { ref, deleteObject } from 'firebase/storage';
import { storage } from "../../../services/firebase";
import { FaImage } from "react-icons/fa6";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

function ProfilePage() {
    const [preview, setPreview] = React.useState(null);
    const [oldImage, setOldImage] = React.useState(null);

  const validationSchema = yup.object({
      sejarah: yup.string().required('Sejarah diperlukan'),
      tentang: yup.string().required('Tentang diperlukan'),
      rt: yup.string().required('RT diperlukan'),
      rw: yup.string().required('RW diperlukan'),
      jumlahPenduduk: yup.string().required('Jumlah Penduduk diperlukan'),
      selectedFile: yup.mixed().nullable().test('fileSize', 'Gambar tidak boleh lebih dari 1MB', (value) => {
        if (!value) return true; // Allow null or undefined values
        return value.size <= 1 * 1024 * 1024;
    })
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

  const handleImageChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
        setOldImage(preview);
        setPreview(URL.createObjectURL(file));
        formik.setFieldValue('selectedFile', file);
    } else {
        formik.setFieldValue('selectedFile', null);
    }
  };


  const formik = useFormik({
    initialValues: {
        sejarah: '',
        tentang: '',
        rt: '',
        rw: '',
        jumlahPenduduk: '',
        selectedFile: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let imageUrl = preview; // Use existing image URL as default

      if (values.selectedFile) {
        // Delete existing image from storage
        const storageRef = ref(storage, oldImage);
        await deleteObject(storageRef);
        const folder = 'profile/';
        const imagePath = await uploadFile(values.selectedFile, folder);
        imageUrl = await getFile(imagePath);
    }
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
                image: imageUrl,
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
      setPreview(querySnapshot.data().image);
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
                    <CardBody className="overflow-auto">
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
                            <div className="mt-2">
                              <label htmlFor='selectedFile' className='text-sm'>Gambar <span className='text-red-500'>*</span></label>
                              <label className='border border-dashed border-gray-500 rounded-lg px-6 pt-6 pb-2 mt-3 flex justify-center'>
                                <div className='text-center'>
                                  <FaImage className='mx-auto h-12 w-12 text-gray-500' />
                                  <span className='mt-2 block text-sm font-semibold text-gray-900'>
                                    Pilih Gambar
                                  </span>
                                  <input
                                    id='selectedFile'
                                    name='selectedFile'
                                    type='file'
                                    onChange={handleImageChange}
                                    className='sr-only'
                                    accept='image/png, image/jpeg, '
                                  />
                                </div>
                              </label>
                              {formik.errors.selectedFile && formik.touched.selectedFile && (
                                <div className='text-red-500'>{formik.errors.selectedFile}</div>
                              )}
                              {preview && (
                                <div className="w-full h-full mt-5 overflow-hidden">
                                  <Image
                                    src={preview}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="mt-6">
                              <Button color="primary" type="submit" className="w-full">Simpan</Button>
                            </div>
                          </div>
                      </form>
                    </CardBody>
                  </Card>
              </div>
            </div>
          </div>
      </div>
  )
}

export default withAuth(ProfilePage);