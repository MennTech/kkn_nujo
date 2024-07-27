import { FaInstagram } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";
const FooterUser = () => {
    return (
        <div className="z-20 mt-10">
            <div className="py-8 border-1">
                <div className="mx-56 max-lg:mx-4 max-xl:mx-16 py-4">
                    <div className="grid grid-cols-2 gap-x-16 max-lg:flex max-lg:flex-col max-lg:gap-y-8">
                        <div className="flex flex-col text-[#08997c] ">
                            <span className="text-xl font-bold">
                                Sosial Media
                            </span>
                            <hr className="border border-b-green-300 w-full mb-2" />
                            {/* TODO: add content here */}
                            <a href="https://www.instagram.com/k1m_nuj0?igsh=MTAxcjd0NnNycGp2ZA==" className="flex gap-x-2 items-center font-bold text-base hover:underline"><BsInstagram/>KIM Nujo</a>
                        </div>
                        <div className="flex flex-col text-[#08997c]">
                            <span className="text-xl font-bold">
                                Lokasi
                            </span>
                            <hr className="border border-b-green-300 w-full mb-2" />
                            <iframe
                                className="w-full h-72 rounded-md"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15395.89460936929!2d110.7829695511213!3d-8.185619381525134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7bc6b357a4560f%3A0x1182aabc92366249!2sNujo%2C%20Pucung%2C%20Kec.%20Girisubo%2C%20Kabupaten%20Gunung%20Kidul%2C%20Daerah%20Istimewa%20Yogyakarta!5e1!3m2!1sid!2sid!4v1721446081461!5m2!1sid!2sid"
                                allowFullScreen={true}
                                loading={"lazy"}
                                referrerPolicy={"no-referrer-when-downgrade"}
                            >
                            </iframe>
                            <p className="font-semibold max-lg:text-sm">
                                Nujo, Pucung, Girisubo, Gunung Kidul, Yogyakarta
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bottom-0 text-center font-semibold text-gray-400">
                <div className="py-4">
                    <span>
                        KKN 85 UAJY - Kelompok 67 &copy; 2024
                    </span>
                </div>
            </div>
        </div>
    )
};

export default FooterUser;