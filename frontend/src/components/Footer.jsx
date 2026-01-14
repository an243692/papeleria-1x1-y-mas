import React from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="bg-primary-blue text-white pt-16 pb-8 px-6 mt-12 relative overflow-hidden">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">

                {/* Contact Info */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-secondary mb-8">CONTACTO</h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Phone className="w-5 h-5 text-purple-300" />
                            </div>
                            <span className="text-lg font-medium">(55) 9135-9392 </span>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Mail className="w-5 h-5 text-pink-300" />
                            </div>
                            <span className="text-lg font-medium break-all">unoporunoymas@hotmail.com</span>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                                <MapPin className="w-5 h-5 text-blue-300" />
                            </div>
                            <span className="text-lg font-medium leading-tight">
                                MESONES 184-B, COL.CENTRO, CP 06090<br />
                                ALC.CUAUHTÉMOC, CDMX.
                            </span>
                        </div>
                    </div>

                    <div className="pt-6">
                        <a
                            href="https://www.facebook.com/1x1yMAS/?locale=es_LA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                        >
                            <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg">
                                <Facebook className="w-5 h-5 text-white" />
                            </button>
                            <span className="text-lg font-medium group-hover:text-blue-300 transition-colors">
                                Fomis 1x1 y Mas
                            </span>
                        </a>
                    </div>
                </div>

                {/* Map */}
                <div className="h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1768336120731!6m8!1m7!1spe4SPOHYtMT5ETs3yDbhtA!2m2!1d19.4277664998765!2d-99.1284259697983!3f49.947350535037266!4f-5.642471763447347!5f2.240932079550953"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación"
                        className="w-full h-full transition-all duration-500"
                    ></iframe>
                </div>

            </div>

            <div className="text-center mt-16 pt-8 border-t border-white/10 text-white/50 text-sm">
                © 2026 Papelería 1x1 y más. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
