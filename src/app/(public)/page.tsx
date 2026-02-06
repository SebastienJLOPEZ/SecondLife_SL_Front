import ThemePopUp from "@/src/components/themePopUp/themePopUp";
import Link from "next/dist/client/link";
import RegionMap from "@/src/components/regionMap/regionMap";
import styles from './page.module.css';
import france from '@svg-maps/france.regions';
import Image from "next/image";

export default function Home() {
  return (
    <main >
      <ThemePopUp />
      <div className={styles.title}>
        <Image src="/Images/logo.webp" alt="Logo SecondLife" width={250} height={250} />
        <h2>Bienvenue sur le site d&apos;échange entre particuliers</h2>
      </div>
      <div className={styles.offerSection}>
        <Link href="/createoffer" className={styles.createButton}>Créer votre offre</Link>
      </div>
      <div className={styles.regionSection}>
        <h3>Trouver des offres par région</h3>
        <div className={styles.regionMapContainer}>
          <div className={styles.mapWrapper}>
            <RegionMap />
          </div>
          <div className={styles.regionList}>
            {france.locations.map((location: { id: string; name: string }) => (
              <Link 
                key={location.id} 
                href={`/offers?region=${encodeURIComponent(location.name)}`}
                className={styles.regionLink}
              >
                {location.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.whoSection}>

      </div>
    </main>
  );
}
