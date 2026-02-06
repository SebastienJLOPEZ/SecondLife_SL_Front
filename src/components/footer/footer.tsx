import Link from 'next/link';
import styles from './footer.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>
                    © {currentYear} SecondLife. Tous droits réservés.
                </p>
                <div className={styles.links}>
                    <Link href="/mentions-legales" className={styles.link}>
                        Mentions légales
                    </Link>
                    <span className={styles.separator}>•</span>
                    <Link href="/conditions-utilisation" className={styles.link}>
                        Conditions d&apos;utilisation
                    </Link>
                </div>
            </div>
        </footer>
    );
}