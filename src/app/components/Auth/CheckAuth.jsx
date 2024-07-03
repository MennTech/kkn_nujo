/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Spinner } from "@nextui-org/react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          router.replace("/admin");
        }
        setInterval(() => {
          setLoading(false);
        }, 1000);
      });

      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return <Spinner color="primary" size="lg" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

export default withAuth;
