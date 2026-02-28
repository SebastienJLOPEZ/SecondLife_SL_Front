'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

// Validation regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Z\u00C0-\u00FF\s'-]+$/;

interface FormErrors {
    name?: string;
    surname?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    // Sanitize input to prevent XSS
    const sanitizeInput = (input: string): string => {
        return input.replace(/[<>]/g, '').trim();
    };

    // Validate form inputs
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Name validation
        const sanitizedName = sanitizeInput(name);
        if (!sanitizedName) {
            newErrors.name = 'Prénom requis';
        } else if (sanitizedName.length < 2 || sanitizedName.length > 50) {
            newErrors.name = 'Le prénom doit contenir entre 2 et 50 caractères';
        } else if (!nameRegex.test(sanitizedName)) {
            newErrors.name = 'Le prénom contient des caractères invalides';
        }

        // Surname validation
        const sanitizedSurname = sanitizeInput(surname);
        if (!sanitizedSurname) {
            newErrors.surname = 'Nom requis';
        } else if (sanitizedSurname.length < 2 || sanitizedSurname.length > 50) {
            newErrors.surname = 'Le nom doit contenir entre 2 et 50 caractères';
        } else if (!nameRegex.test(sanitizedSurname)) {
            newErrors.surname = 'Le nom contient des caractères invalides';
        }

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
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)';
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirmation du mot de passe requise';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate before submission
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: sanitizeInput(name), 
                    surname: sanitizeInput(surname), 
                    email: sanitizeInput(email), 
                    password 
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Inscription réussie !");
                setTimeout(() => {
                    router.push('/login');
                }, 200);
            } else {
                alert(`Erreur lors de l'inscription : ${data.message}`);
            }
        } catch (error) {
            console.error('[Register] Erreur réseau:', error);
            alert('Erreur de connexion au serveur');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Inscription</h1>
            <div>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div>
                        <div>
                            <label htmlFor="name">Prénom</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                maxLength={50}
                                autoComplete="given-name"
                            />
                            {errors.name && <span className={styles.error}>{errors.name}</span>}
                        </div>
                        <div>
                            <label htmlFor="surname">Nom</label>
                            <input 
                                type="text" 
                                id="surname" 
                                value={surname} 
                                onChange={(e) => setSurname(e.target.value)} 
                                required 
                                maxLength={50}
                                autoComplete="family-name"
                            />
                            {errors.surname && <span className={styles.error}>{errors.surname}</span>}
                        </div>
                    </div>

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
                            autoComplete="new-password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password}</span>}

                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <div >
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            id="confirmPassword" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            maxLength={100}
                            autoComplete="new-password"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                    
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>
            </div>
            <p>Déjà inscrit ? <Link href="/login">Se connecter</Link>.</p>
        </div>
    );
}