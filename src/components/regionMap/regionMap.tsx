'use client';

import { useRouter } from 'next/navigation';
import styles from './regionMap.module.css';
import france from '@svg-maps/france.regions';

export default function RegionMap() {
    const router = useRouter();

    const handleRegionClick = (event: React.MouseEvent<SVGPathElement>) => {
        const regionName = event.currentTarget.getAttribute('name');
        if (regionName) {
            // Rediriger vers la page des offres avec le filtre de région
            router.push(`/offers?region=${encodeURIComponent(regionName)}`);
        }
    };

    return (
        <div className={styles.mapContainer}>
            <svg 
                viewBox={france.viewBox} 
                className={styles.map}
                xmlns="http://www.w3.org/2000/svg"
            >
                {france.locations.map((location: any) => (
                    <path
                        key={location.id}
                        id={location.id}
                        name={location.name}
                        d={location.path}
                        className={styles.region}
                        onClick={handleRegionClick}
                        aria-label={location.name}
                    />
                ))}
            </svg>
        </div>
    );
}
