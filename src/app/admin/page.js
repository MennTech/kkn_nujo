'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Button, Input, Spinner } from "@nextui-org/react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { auth } from "../../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  const validateEmail = (value) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  const isInvalid = React.useMemo(() => email !== "" && !validateEmail(email), [email]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/admin/profile");
    });
    setInterval(() => {
      setLoading(false);
    }, 1000);
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isInvalid || email === "" || password === "") return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin/profile");
    } catch (error) {
      setError("Failed to login. Please check your email and password.");
    }
  };


  if (loading) return <Spinner color="primary" size="lg" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <Card className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <CardHeader className="text-center text-2xl font-bold text-gray-700">Masuk Ke Dashboard</CardHeader>
          <form onSubmit={handleLogin}>
          <CardBody className="space-y-4">
            <span className="text-sm text-gray-500">Silahkan masuk untuk melanjutkan ke dashboard</span>
            <div className="relative">
              <Input
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`border-gray-300 focus:ring-2 ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              {isInvalid && <p className="text-red-500 text-sm mt-1">Invalid email address</p>}
            </div>
            <div className="relative">
              <Input
                fullWidth
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer" onClick={toggleVisibility}>
                {isVisible ? <IoMdEyeOff /> : <IoMdEye />}
              </span>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <Button type="submit" fullWidth color="gradient" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isInvalid || email === "" || password === ""}>Login</Button>
          </CardBody>
          </form>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
