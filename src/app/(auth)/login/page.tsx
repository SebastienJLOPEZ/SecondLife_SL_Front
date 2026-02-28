'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens } from '@//src/lib/auth';
import styles from './login.module.css';
import Link from 'next/link';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Sanitize input to prevent XSS
    const sanitizeInput = (input: string): string => {
        return input.replace(/[<>]/g, '').trim();
    };

    // Validate form inputs
    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        // Email validation
        const sanitizedEmail = sanitizeInput(email);
        if (!sanitizedEmail) {
            newErrors.email = 'Email requis';
        } else if (!emailRegex.test(sanitizedEmail)) {
            newErrors.email = 'Format email invalide';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Mot de passe requis';
        } else if (password.length < 1) {
            newErrors.password = 'Mot de passe requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        console.log('[Login] Tentative de connexion pour:', sanitizeInput(email));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: sanitizeInput(email), 
                    password: password 
                }),
            });

            const data = await res.json();
            if (res.ok) {
                console.log('[Login] Connexion réussie, stockage des tokens', {
                    hasAccessToken: !!data.accessToken,
                    hasRefreshToken: !!data.refreshToken,
                    accessTokenLength: data.accessToken?.length,
                    refreshTokenLength: data.refreshToken?.length
                });
                
                // Utiliser la fonction setTokens pour assurer la cohérence
                setTokens(data.accessToken, data.refreshToken);
                
                alert('Connexion réussie !');
                setTimeout(() => {
                    router.back();
                }, 200);
            } else {
                console.error('[Login] Erreur de connexion:', data.message);
                alert('Erreur de connexion : ' + data.message);
            }
        } catch (error) {
            console.error('[Login] Erreur réseau:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Connexion</h1>
            <div>
                <form onSubmit={handleLogin} className={styles.form}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        maxLength={100}
                        autoComplete="email"
                    />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}

                    <label htmlFor="password">Mot de passe</label>
                    <div >
                        <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            maxLength={100}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password}</span>}

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
                <p>Pas encore de compte ? <Link href="/register">S&apos;inscrire</Link></p>
            </div>
        </div>
    );
}
