'use client';

import React, { useState, useEffect } from 'react';
import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import { db } from '../../../../../services/firebase';
import { collection, where, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Button, Image, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import ReactQuill from "react-quill";
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

// Validation schema for form fields
const validationSchema = yup.object({
    judul: yup.string().required('Judul diperlukan'),
    content: yup.string().required('Content diperlukan'),
    selectedFile: yup.mixed().nullable().test('fileSize', 'Gambar tidak boleh lebih dari 1MB', (value) => {
        if (!value) return true; // Allow null or undefined values
        return value.size <= 1*1024*1024;
    })
})

const UbahArtikelPage = ({ params }) => {
    const [preview, setPreview] = useState(null);
    const [oldImage, setOldImage] = useState(null);
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
                id: slugify(values.judul, { lower: true }),
                judul: values.judul,
                content: values.content,
                image: imageUrl
            });

            toast.success('Artikel berhasil diubah', {
                position: 'top-right',
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
                formik.setFieldValue('judul', data.judul);
                formik.setFieldValue('content', data.content);
                setPreview(data.image);
            });
        };
        fetchData();
    }, []);

    return (
        <div className='bg-gradient-to-br from-slate-100 to-purple-500 overflow-x-hidden'>
            <NavbarAdmin path={'artikel'} />
            <div className="w-screen flex justify-center items-center content-center my-5">
                <div className="w-screen max-w-[1024px] px-6 min-w-[420px]:px-6">
                    <Card>
                        <CardHeader>
                            <p className='text-medium font-semibold'>Ubah Artikel</p>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <form onSubmit={formik.handleSubmit}>
                                <div className='grid grid-rows-2 gap-4'>
                                    <div>
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
                                        <Input 
                                            type='file'
                                            onChange={handleImageChange}
                                            accept='image/*'
                                            label='Gambar'
                                            labelPlacement='outside'
                                            placeholder='Pilih Gambar'
                                            name='selectedFile'
                                        />
                                        {formik.errors.selectedFile && formik.touched.selectedFile && (
                                            <div className="text-red-500 text-sm">{formik.errors.selectedFile}</div>
                                        )}
                                    </div>
                                    {preview && <Image src={preview} width='50%' />}
                                    <div className='h-52'>
                                        <ReactQuill 
                                            theme='snow'
                                            modules={modules}
                                            value={formik.values.content}
                                            onChange={(content) => formik.setFieldValue('content', content)}
                                            key='content'
                                            className='sm:h-[80%] h-[70%]'
                                            placeholder='Isi Content'
                                        />
                                    </div>
                                    {formik.errors.content && formik.touched.content && (
                                        <div className="text-red-500 text-sm">{formik.errors.content}</div>
                                    )}
                                    <Button color="primary" onClick={formik.handleSubmit}>Simpan</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default withAuth(UbahArtikelPage);
