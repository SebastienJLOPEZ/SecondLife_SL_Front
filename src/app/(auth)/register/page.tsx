'use client';

import Link from 'next/link';
import { /*useEffect,*/ useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // if (!passwordRegex.test(password)) {
        //     alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
        //     return;
        // }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, email, password }),
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
    }

    return (
        <div className={styles.container}>
            <h1>Inscription</h1>
            <div>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div>
                        <div>
                            <label htmlFor="name">Prénom</label>
                            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="surname">Nom</label>
                            <input type="text" id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                        </div>
                    </div>

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label htmlFor="password">Mot de passe</label>
                    <div >
                        <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                    <div >
                        <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button 
                            type="button" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <button type="submit">S&apos;inscrire</button>
                </form>
            </div>
            <p>Déjà inscrit ? <Link href="/login">Se connecter</Link>.</p>
        </div>
    );
}