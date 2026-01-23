import React from 'react';
import tiktokLogo from '../assets/tiktok_new.png';

const TikTokButton = () => {
    return (
        <a
            href="https://www.tiktok.com/@papeleria.1x1ymas"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-36 right-4 sm:bottom-24 sm:right-6 z-[1100] w-14 h-14 bg-black hover:bg-gray-900 rounded-full shadow-lg shadow-black/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse-slow"
            style={{ animationDelay: '1.5s' }}
        >
            {/* TikTok Official Logo */}
            <img src={tiktokLogo} alt="TikTok" className="w-full h-full object-cover rounded-full" />
        </a>

    );
};

export default TikTokButton;
