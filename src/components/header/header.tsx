'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { clearTokens } from '@/src/lib/auth';
import styles from './header.module.css';
import NotificationPanel from '../notificationPanel/notificationPanel';
import Image from 'next/image';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    useEffect(() => {
        // Check initial auth state
        const checkAuthState = () => {
            setIsLoggedIn(!!localStorage.getItem('accessToken'));
        };
        
        checkAuthState();

        // Listen for auth state changes
        window.addEventListener('authStateChanged', checkAuthState);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('authStateChanged', checkAuthState);
        };
    }, []);

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.logo}>
                        <Link href="/"><Image src="/images/logo.webp" alt="SecondLife Logo" width={64} height={64} /></Link>
                    </li>
                    <li>
                        <Link href="/offers">Offres</Link>
                    </li>
                    <li>
                        <Link href="/forum">Forum</Link>
                    </li>
                    <li>
                        <Link href="/articles">Articles</Link>
                    </li>
                    <div className={styles.spacer}></div>
                    {isLoggedIn ? (
                        <>
                            <li className={styles.notificationContainer}>
                                <button 
                                    className={styles.notificationButton}
                                    onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                                >
                                    🔔
                                </button>
                            </li>
                            <li className={styles.messagesMenu}>
                                <Link href="/messages">💬</Link>
                            </li>
                            <li className={styles.profileMenu}>
                                <button 
                                    className={styles.profileButton}
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                >
                                    👤
                                </button>
                                {isProfileMenuOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)}>Mon Profil</Link>
                                        <Link href="/createoffer" onClick={() => setIsProfileMenuOpen(false)}>Créer une Offre</Link>
                                        <Link href="/settings" onClick={() => setIsProfileMenuOpen(false)}>Paramètres</Link>
                                        <button 
                                            onClick={() => {
                                                clearTokens();
                                                setIsProfileMenuOpen(false);
                                                window.location.href = '/';
                                            }}
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href="/register">Inscription</Link>
                            </li>
                            <li>
                                <Link href="/login">Connexion</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
            {isNotificationPanelOpen && (
                <NotificationPanel setIsNotificationPanelOpen={setIsNotificationPanelOpen} />
            )}
        </header>
    );
}
