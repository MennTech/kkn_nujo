'use client'

import NavbarAdmin from "@/components/TopNavbar/NavbarAdmin";
import React from "react";
import { db } from "../../../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Image, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import 'react-quill/dist/quill.snow.css';
import { getFile, uploadFile } from "@/libs/storage";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as yup from "yup";
import slugify from "slugify";
import withAuth from "@/components/Auth/CheckAuth";
import dynamic from "next/dynamic";
// import Uploader from "@/components/Input/UploadImages";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const validationSchema = yup.object({
    judul: yup.string().required('Judul diperlukan'),
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
                content: values.content,
                image: imageUrl,
                tanggalPembuatan: formatDate(new Date())
            })
            .then(() => {
                toast.success('Berhasil menambahkan data',{
                    position: 'top-right',
                });
                resetForm();
                setPreview(null);
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
        <div className="h-screen bg-gradient-to-br from-slate-100 to-purple-500">
            <NavbarAdmin path='artikel'/>
            <div className="w-screen flex justify-center items-center content-center mt-5">
                <div className="w-screen max-w-[1024px] px-6 min-w-[420px]:px-6">
                    <Card>
                        <CardHeader>
                            <p className="text-medium">Tambah Artikel</p>
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="grid grid-rows-2 gap-4">
                                    <div>
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
                                        <Input 
                                            type="file" 
                                            onChange={handleImageChange} 
                                            accept=".jpg,.png,.jpeg" 
                                            label='Gambar' 
                                            labelPlacement="outside" 
                                            placeholder="Pilih Gambar" 
                                            name="selectedFile"
                                            isRequired
                                        />
                                        {formik.errors.selectedFile && formik.touched.selectedFile && (
                                            <div className="text-red-500 text-sm">{formik.errors.selectedFile}</div>
                                        )}
                                    </div>
                                    <Image src={preview} width='50%'/>
                                    <div className="h-52">
                                        <ReactQuill 
                                            theme="snow" 
                                            onChange={(value) => formik.setFieldValue('content', value)} 
                                            placeholder="Isi Content" 
                                            key='content' 
                                            value={formik.values.content} 
                                            modules={modules} 
                                            className="sm:h-[80%] h-[70%]"
                                        />
                                    </div>
                                    {formik.errors.content && formik.touched.content && (
                                        <div className="text-red-500 text-sm">{formik.errors.content}</div>
                                    )}
                                    <Button color="primary" type="submit" className="mt-5">Tambah</Button>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withAuth(TambahArtikelPage);