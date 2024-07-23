'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Parallax} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../Carousel/Carousel.css'

const Carousel = () => {
    const slides = [
        {
            image: '/Images/Carousel/3.png',
            title: 'SELAMAT DATANG'
        },
        {
            image: '/Images/Carousel/1.jpg',
            title: 'Slide 1',
        },
        {
            image: '/Images/Carousel/2.png',
            title: 'Wisata Pantai Srakung',
        },
    ];

    return (
        <>
        <section className="w-full">
            <div className="h-[90vh] w-full">
                <Swiper
                    slidesPerView={1}
                    parallax={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Autoplay, Parallax]}
                    className="mySwiper w-full h-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index} className="relative">
                            <img src={slide.image} className="object-cover h-full w-full" alt={`carousel-${index}`} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4">
                                <h2 className="text-3xl md:text-7xl mb-2 font-bold text-center" data-swiper-parallax="-300">{slide.title}</h2>
                            </div>
                            <div className="gradient-overlay"></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
        </>
    );
};

export default Carousel;
