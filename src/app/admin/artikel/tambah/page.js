'use client'

import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import React from "react";
import { db } from "../../../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Image, Input, Card, CardHeader, CardBody, Divider, DatePicker } from "@nextui-org/react";
import 'react-quill/dist/quill.snow.css';
import { getFile, uploadFile } from "@/libs/storage";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import withAuth from "@/components/Auth/CheckAuth";
import dynamic from "next/dynamic";
import {getLocalTimeZone, parseDate ,today} from "@internationalized/date"
import { useRouter } from 'next/navigation';

// import Uploader from "@/components/Input/UploadImages";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const validationSchema = yup.object({
    judul: yup.string().required('Judul diperlukan'),
    tanggalKegiatan: yup.date().required('Tanggal Kegiatan diperlukan'),
    content: yup.string().required('Content diperlukan'),
    selectedFile: yup.mixed().required('Gambar diperlukan')
        .test('fileSize', 'File terlalu besar, maksimal 1MB', (value) => {
            return value && value.size <= 1 * 1024 * 1024;
        })
});

const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    }).format(date);
}

const TambahArtikelPage = () => {
    const [preview, setPreview] = React.useState(null);
    const router = useRouter();
    const modules =  {
        toolbar: [
            [{font:[]}],
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{align:[]}],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
            ['link'],
        ]
    };

    const formik = useFormik({
        initialValues: {
            judul: '',
            tanggalKegiatan: null,
            content: '',
            selectedFile: null
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { resetForm }) => {
            let imageUrl = '';
            if(values.selectedFile){
                const folder = 'artikel/';
                const imagePath = await uploadFile(values.selectedFile, folder);
                imageUrl = await getFile(imagePath);
            }
            await addDoc(collection(db, "artikel"), {
                id: slugify(values.judul, {lower: true}),
                judul: values.judul,
                tanggalKegiatan: formatDate(values.tanggalKegiatan),
                content: values.content,
                image: imageUrl,
                tanggalPembuatan: formatDate(new Date())
            })
            .then(() => {
                resetForm();
                setPreview(null);
                router.push('/admin/artikel');
                toast.success('Berhasil menambahkan data',{
                    position: 'top-right',
                    duration: 2000
                });
            });
        },
    });

    const handleImageChange = (e) => {
        const file = e?.target?.files?.[0];
        if(file) {
            formik.setFieldValue('selectedFile', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-purple-500 overflow-hidden">
            <NavbarAdmin path='artikel'/>
            <div className="h-full py-10">
                <div className="flex justify-center items-center h-full">
                    <div className="w-full mt-4 max-w-[1024px] px-6 min-w-[420px]:px-6">
                        <Card className="flex flex-col gap-y-2">
                            <CardHeader>
                                <p className="text-medium">Tambah Artikel</p>
                            </CardHeader>
                            <Divider/>
                            <CardBody>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="">
                                        <div className="my-4">
                                            <Input 
                                                type="text" 
                                                label='Judul' 
                                                labelPlacement="outside" 
                                                placeholder="Masukkan Judul Artikel" 
                                                onChange={formik.handleChange} 
                                                value={formik.values.judul} 
                                                name="judul"
                                                isRequired
                                            />
                                            {formik.errors.judul && formik.touched.judul && (
                                                <div className="text-red-500 text-sm">{formik.errors.judul}</div>
                                            )}
                                        </div>
                                        <div>
                                            <DatePicker showMonthAndYearPickers maxValue={today()} label='Tanggal Kegiatan' labelPlacement="outside" name="tanggalKegiatan" onChange={value => formik.setFieldValue('tanggalKegiatan',new Date(value))} isRequired/>
                                            {formik.errors.tanggalKegiatan && formik.touched.tanggalKegiatan && (
                                                <div className="text-red-500 text-sm">{formik.errors.tanggalKegiatan}</div>
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <div>
                                                <label htmlFor="selectedFile" className="text-sm">Gambar <span className="text-red-500">*</span></label>
                                            </div>
                                            <input
                                                type="file" 
                                                id="selectedFile"
                                                onChange={handleImageChange} 
                                                accept="image/*" 
                                                label='Gambar' 
                                                placeholder="Pilih Gambar" 
                                                name="selectedFile"
                                            />
                                            {formik.errors.selectedFile && formik.touched.selectedFile && (
                                                <div className="text-red-500 text-sm">{formik.errors.selectedFile}</div>
                                            )}
                                        </div>
                                        <div className="my-4">
                                            <Image src={preview} className="w-full aspect-[16/9]"/>
                                        </div>
                                        <div className="h-52 mb-5">
                                            <label htmlFor="konten" className="text-sm">Konten <span className="text-red-500">*</span></label>
                                            <ReactQuill 
                                                theme="snow" 
                                                id="konten"
                                                onChange={(value) => formik.setFieldValue('content', value)} 
                                                placeholder="Isi Content" 
                                                key='content' 
                                                value={formik.values.content} 
                                                modules={modules} 
                                                className="sm:h-[80%] h-[60%]"
                                            />
                                        </div>
                                        {formik.errors.content && formik.touched.content && (
                                            <div className="text-red-500 text-sm">{formik.errors.content}</div>
                                        )}
                                        <div className="w-full mt-10">
                                            <Button color="primary" type="submit" className="w-full" onClick={formik.handleSubmit}>Tambah</Button>
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
}

export default withAuth(TambahArtikelPage);