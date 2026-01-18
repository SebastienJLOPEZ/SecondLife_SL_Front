'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    useEffect(() => {
        // Only check localStorage after component mounts on client
        setIsLoggedIn(!!localStorage.getItem('accessToken'));
    }, []);

    return (
        <header className={styles.header}>
            <nav>
                <ul className={styles.navList}>
                    <li className={styles.logo}>
                        <Link href="/">🏠 SecondLife</Link>
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
                            <li>
                                <Link href="/notifications" className={styles.notification}>
                                    🔔
                                </Link>
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
                                        <Link href="/settings" onClick={() => setIsProfileMenuOpen(false)}>Paramètres</Link>
                                        <button 
                                            onClick={() => {
                                                localStorage.removeItem('accessToken');
                                                localStorage.removeItem('refreshToken');
                                                setIsLoggedIn(false);
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
        </header>
    );
}
