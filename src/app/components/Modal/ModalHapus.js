import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button } from "@nextui-org/react";
import {db} from "../../../services/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../../services/firebase";
import { toast } from "sonner";

const ModalHapus = ({ id, reload, linkImage}) => {
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  
  const hapusData = async () => {
    await deleteDoc(doc(db, "artikel", id));
    const storageRef = ref(storage, linkImage);
    await deleteObject(storageRef);
    toast.success("Data berhasil dihapus",{
      position: "top-right",
      duration: 2000,
    });
    reload();
  };
  
  return (
    <>
      <Button onPress={onOpen} color="danger">
        Hapus
      </Button>
      <Modal
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Hapus Data
              </ModalHeader>
              <ModalBody>
                <p>Yakin ingin menghapus data ini?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Tidak
                </Button>
                <Button color="primary" onPress={onClose} onClick={hapusData}>
                  Iya
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalHapus;
