'use client';

import { useEffect, useState } from 'react';
import styles from './themePopUp.module.css';

export default function ThemePopUp() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<string>('');

    const setCookie = (name: string, value: string, days: number) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    };

    const getCookie = (name: string): string | null => {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }
        return null;
    };

    const togglePopUp = () => {
        setIsOpen(false);
        setCookie('themePopUpClosed', 'true', 7); // Cookie expire après 7 jours
    };

    useEffect(() => {
        // Vérifier si le cookie existe
        const popUpClosed = getCookie('themePopUpClosed');
        
        // Ouvrir le pop-up seulement si le cookie n'existe pas
        if (!popUpClosed) {
            setIsOpen(true);
        }

        const fetchTheme = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/weeklytheme`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await res.json();
        if (data.success) {
            setTheme(data.theme);
        }
        };

        fetchTheme();
    }, []);
    return (
        <div>
            {isOpen && (
                <div className={styles.popUp}>
                    <div className={styles.popUpContent}>
                        <h2>Thème de la semaine : {theme}</h2>
                        <p>Partagez vos objets en lien avec ce thème et découvrez des offres spéciales !</p>
                        <button onClick={togglePopUp} className={styles.closeButton}>Fermer</button>
                    </div>
                </div>
            )}
        </div>
    );
}
