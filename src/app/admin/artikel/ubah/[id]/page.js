'use client';

import React, { useState, useEffect } from 'react';
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { db } from '../../../../../services/firebase';
import { collection, where, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Button, Image, Input, Card, CardHeader, CardBody, Divider, DatePicker } from "@nextui-org/react";
import 'react-quill/dist/quill.snow.css';
import { getFile, uploadFile } from "@/libs/storage";
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../../../../services/firebase';
import { toast } from "sonner";
import { useFormik } from "formik";
import { useRouter } from 'next/navigation';
import * as yup from "yup";
import slugify from "slugify";
import withAuth from '@/components/Auth/CheckAuth';
import dynamic from "next/dynamic";
import { FaImage } from "react-icons/fa6";
import { today, parseAbsoluteToLocal } from "@internationalized/date";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Validation schema for form fields
const validationSchema = yup.object({
    judul: yup.string().required('Judul diperlukan'),
    tanggalKegiatan: yup.string().required('Tanggal Kegiatan diperlukan'),
    content: yup.string().required('Content diperlukan'),
    selectedFile: yup.mixed().nullable().test('fileSize', 'Gambar tidak boleh lebih dari 1MB', (value) => {
        if (!value) return true; // Allow null or undefined values
        return value.size <= 1 * 1024 * 1024;
    })
});

const UbahArtikelPage = ({ params }) => {
    const [preview, setPreview] = useState(null);
    const [oldImage, setOldImage] = useState(null);
    const [date, setDate] = useState(null);
    const router = useRouter();
    const { id } = params;

    // ReactQuill modules configuration
    const modules = {
        toolbar: [
            [{ font: [] }],
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            ['link']
        ]
    };

    // Formik for form handling and validation
    const formik = useFormik({
        initialValues: {
            judul: '',
            tanggalKegiatan: null,
            content: '',
            selectedFile: null
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let imageUrl = preview; // Use existing image URL as default

            if (values.selectedFile) {
                // Delete existing image from storage
                const storageRef = ref(storage, oldImage);
                await deleteObject(storageRef);
                const folder = 'artikel/';
                const imagePath = await uploadFile(values.selectedFile, folder);
                imageUrl = await getFile(imagePath);
            }

            // Updating the document in Firestore
            const q = query(collection(db, 'artikel'), where('id', '==', id));
            const querySnapshot = await getDocs(q);
            const docRef = doc(db, 'artikel', querySnapshot.docs[0].id);
            await updateDoc(docRef, {
                id: slugify(values.judul, { lower: true, remove: /[*+~.()'"!:@]/g }),
                judul: values.judul,
                tanggalKegiatan: values.tanggalKegiatan.toISOString(),
                content: values.content,
                image: imageUrl
            });

            toast.success('Artikel berhasil diubah', {
                position: 'top-right',
                duration: 2000
            });
            router.push('/admin/artikel');
        }
    });

    // Handle image change and set preview
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

    // Fetching data for the article to be edited
    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, 'artikel'), where('id', '==', id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // const date = parseAbsoluteToLocal(data.tanggalKegiatan);
                formik.setFieldValue('judul', data.judul);
                // formik.setFieldValue('tanggalKegiatan', date);
                formik.setFieldValue('content', data.content);
                setPreview(data.image);
                setDate(new Date(data.tanggalKegiatan).toLocaleString("id-ID", {dateStyle: 'full'}));
            });
        };

        fetchData();
    }, []);

    return (
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-purple-500 overflow-hidden'>
            <NavbarAdmin path={'artikel'} />
            <div className='h-full py-10'>
                <div className="flex justify-center items-center h-full">
                    <div className="w-full mt-4 max-w-[1024px] px-6 min-w-[420px]:px-6">
                        <Card className='flex flex-col gap-y-2'>
                            <CardHeader>
                                <p className='text-medium font-semibold'>Ubah Artikel</p>
                            </CardHeader>
                            <Divider />
                            <CardBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className=''>
                                        <div className='my-4'>
                                            <Input
                                                type='text'
                                                label='Judul'
                                                placeholder='Judul'
                                                isRequired
                                                labelPlacement='outside'
                                                value={formik.values.judul}
                                                onChange={formik.handleChange('judul')}
                                            />
                                            {formik.errors.judul && formik.touched.judul && (
                                                <div className="text-red-500 text-sm">{formik.errors.judul}</div>
                                            )}
                                        </div>
                                        <div>
                                            <DatePicker
                                                showMonthAndYearPickers
                                                maxValue={today()}
                                                label='Tanggal Kegiatan'
                                                labelPlacement='outside'
                                                name='tanggalKegiatan'
                                                onChange={value => {
                                                    formik.setFieldValue('tanggalKegiatan', new Date(value))
                                                }}
                                                // value={formik.values.tanggalKegiatan}
                                                isRequired
                                            />
                                            {formik.errors.tanggalKegiatan && formik.touched.tanggalKegiatan && (
                                                <div className="text-red-500 text-sm">{formik.errors.tanggalKegiatan}</div>
                                            )}
                                            <span className='text-xs text-gray-500'>Tanggal Sebelumnya: {date}</span>
                                        </div>
                                        <div className='flex flex-col mt-2'>
                                            <label htmlFor='selectedFile' className='text-sm'>Gambar <span className='text-red-500'>*</span></label>
                                            <label className='border-[2px] border-dashed flex justify-center items-center min-h-40 w-fit min-w-40 max-w-80 rounded-2xl'>
                                                <input className='w-full h-full sr-only' type="file" accept="image/*" onChange={handleImageChange} />
                                                {preview ? (
                                                    <Image isZoomed src={preview} alt='preview' className='object-cover max-h-40 max-w-80 w-full rounded-lg' />
                                                ) :
                                                    (
                                                        <>
                                                            <div className='flex flex-col justify-center items-center'>
                                                                <FaImage size={32} className='text-gray-400' />
                                                                <p className='text-[14px] text-gray-400'>unggah thumbnail</p>
                                                            </div>
                                                        </>
                                                    )}
                                            </label>
                                            {formik.errors.selectedFile && formik.touched.selectedFile && (
                                                <div className="text-red-500 text-sm">{formik.errors.selectedFile}</div>
                                            )}
                                        </div>
                                        <div className='h-52 mb-6'>
                                            <label htmlFor='konten' className='text-sm'>Konten <span className='text-red-500'>*</span></label>
                                            <ReactQuill
                                                id='konten'
                                                theme='snow'
                                                modules={modules}
                                                value={formik.values.content}
                                                onChange={(content) => formik.setFieldValue('content', content)}
                                                key='content'
                                                className='sm:h-[80%] h-[60%]'
                                                placeholder='Isi Content'
                                            />
                                        </div>
                                        {formik.errors.content && formik.touched.content && (
                                            <div className="text-red-500 text-sm">{formik.errors.content}</div>
                                        )}
                                        <div className='w-full mt-10'>
                                            <Button color="primary" onClick={formik.handleSubmit} className='w-full'>Simpan</Button>
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

export default withAuth(UbahArtikelPage);
