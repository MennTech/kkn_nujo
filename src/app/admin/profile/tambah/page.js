'use client'

import React from "react";
import { db } from "../../../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getFile, uploadFile } from "@/libs/storage";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { toast } from "sonner";
import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Divider, Image, Input } from "@nextui-org/react";
import withAuth from "@/components/Auth/CheckAuth";

const TambahProfilePage = () => {
    const [sejarah, setSejarah] = useState('');
    const [tentang, setTentang] = useState('');
    const [fotoProfil, setFotoProfil] = useState(null);
    const [preview, setPreview] = useState(null);

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

    const handleSejarah = (value) => {
        setSejarah(value);
    }

    const handleTentang = (value) => {
        setTentang(value);
    }

    const handleFotoProfil = (e) => {
        const file = e.target.files[0];
        if(file){
            setFotoProfil(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl = '';
        if(fotoProfil){
            const folder = 'profile/';
            const imagePath = await uploadFile(fotoProfil, folder);
            imageUrl = await getFile(imagePath);
        }
        await addDoc(collection(db, "profile"), {
            sejarah: sejarah,
            tentang: tentang,
            fotoProfil: imageUrl
        })
        .then(() => {
            toast.success('Berhasil menambahkan data',{
                position: 'top-right',
            });
            setPreview(null);
        });
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <h4>Tambah Profile</h4>
                    </CardHeader>
                    <CardBody>
                        <ReactQuill theme="snow" modules={modules} value={sejarah} onChange={handleSejarah}/>
                        <Divider/>
                        <ReactQuill theme="snow" modules={modules} value={tentang} onChange={handleTentang}/>
                        <Divider/>
                        <Input type="file" label="Foto Profil" onChange={handleFotoProfil}/>
                        <Divider/>
                        <Image src={preview} width={100} height={100}/>
                        <Divider/>
                        <Button color="primary" type="submit">Simpan</Button>
                    </CardBody>
                </Card>
            </form>        
        </div>
    )
}

export default withAuth(TambahProfilePage);