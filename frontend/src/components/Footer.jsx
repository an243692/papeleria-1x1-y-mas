import React from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-auto pt-16 pb-12 overflow-hidden bg-[#3f51b5] text-white font-body">

            {/* Container */}
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                    {/* Left Column: Info */}
                    <div className="flex flex-col space-y-8 pt-4">

                        {/* Header */}
                        <div className="text-center md:text-left">
                            <h2 className="font-display text-4xl font-bold mb-2 drop-shadow-md">
                                <span className="text-[#1034a6]">Papelería</span> <span className="text-[#e91e63]">1x1 y Mas</span>
                            </h2>
                            <p className="text-blue-100 font-medium text-lg opacity-90">
                                ¡Dando vida a tus ideas con los mejores materiales!
                            </p>
                        </div>

                        {/* List of details */}
                        <div className="space-y-6">

                            {/* Phone */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                                    style={{ backgroundColor: 'rgba(217, 70, 239, 0.2)', borderColor: 'rgba(217, 70, 239, 0.3)' }} // Fuchsia
                                >
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <a href="tel:+525591359392" className="text-white font-bold text-xl tracking-wide hover:text-blue-200 transition-colors">
                                    (55) 9135-9392
                                </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border"
                                    style={{ backgroundColor: 'rgba(244, 63, 94, 0.2)', borderColor: 'rgba(244, 63, 94, 0.3)' }} // Rose
                                >
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white font-bold text-lg tracking-wide leading-tight">
                                    unoporunoymas<br />@hotmail.com
                                </span>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1 border"
                                    style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: 'rgba(6, 182, 212, 0.3)' }} // Cyan
                                >
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-white font-bold text-base leading-snug uppercase">
                                    <p>CALLE LAS CRUCES 54 LOC.B</p>
                                    <p>CENTRO CUAUHTÉMOC C.P.</p>
                                    <p>06060 CDMX</p>
                                    <p>ALC.CUAUHTÉMOC, CDMX.</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="pt-2 flex flex-col gap-4 items-center md:items-start">
                            <a
                                href="https://www.facebook.com/1x1yMAS/?locale=es_LA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white text-[#3f51b5] px-6 py-3 rounded-full hover:bg-gray-100 transition-all shadow-md font-semibold text-base w-full md:w-auto justify-center"
                            >
                                <Facebook className="w-5 h-5 fill-current" />
                                <span>Síguenos en Facebook</span>
                            </a>

                            <a
                                href="https://www.tiktok.com/@papeleria.1x1ymas"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition-all shadow-md font-semibold text-base w-full md:w-auto justify-center"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                                </svg>
                                <span>Síguenos en TikTok</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Map */}
                    {/* Usamos aspect-ratio cuadrado o 4:3 para que no se vea aplastado */}
                    <div className="w-full h-full min-h-[400px] md:aspect-square lg:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-black/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!4v1768631318442!6m8!1m7!1sG0ADff5oSkbFrjQ3xgGC2g!2m2!1d19.42670462151795!2d-99.1297815836771!3f94.61103383792997!4f-1.7392540674319719!5f0.4000000000000002"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ubicación"
                            className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                        ></iframe>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-16 border-t border-white/10 pt-8 text-center">
                    <p className="text-blue-100 text-sm font-medium opacity-80">
                        &copy; {new Date().getFullYear()} Papelería 1x1 y más. Todos los derechos reservados.
                    </p>
                </div>
            </div>


        </footer>
    );
};

export default Footer;
