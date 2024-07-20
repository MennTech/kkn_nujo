import FooterUser from "@/components/Footer/footer"
import NavbarUser from "@/components/TopNavbar/NavbarUser"
import { FaHome } from "react-icons/fa";
import { Link, Card, CardBody } from "@nextui-org/react";

const Profile = () => {
    return (
        <>
            <NavbarUser/>
            <div className="h-full max-w-5xl w-full mx-auto mt-5">
                <nav className="mx-6 p-2 rounded">
                    <ol className="flex space-x-1">
                        <li className="flex justify-center items-center font-bold text-medium">
                            <Link href="/" className="text-[#08997c] gap-1"><FaHome/>Home<span>/</span></Link>
                        </li>
                        <li className="text-[#08997c] font-bold text-medium">Profile</li>
                    </ol>
                </nav>
                
            </div>
            <FooterUser/>
        </>
    )
}

export default Profile