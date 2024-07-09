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
            subtitle: 'Subtitle 1',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec.'
        },
        {
            image: '/Images/Carousel/2.jpg',
            title: 'Slide 2',
            subtitle: 'Subtitle 2',
            text: 'Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquam hendrerit lorem at elit facilisis rutrum.'
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
                                <h2 className="text-7xl mb-2" data-swiper-parallax="-300">{slide.title}</h2>
                                <h3 className="text-2xl mb-4" data-swiper-parallax="-200">{slide.subtitle}</h3>
                                <p className="text-lg" data-swiper-parallax="-100">{slide.text}</p>
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
