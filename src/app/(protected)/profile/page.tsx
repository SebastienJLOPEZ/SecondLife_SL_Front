'use client';

import { useState, useEffect } from 'react';
import styles from './profile.module.css';
import { User } from '@/src/types/user';
import api from '@/src/lib/api';


export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [updatingInfo, setUpdatingInfo] = useState(false);
    // Profile update data here
    const [profileData, setProfileData] = useState({
        name: '',
        surname: '',
        email: '',
        region: '',
        department: '',
        city: ''
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await api.get('/api/user/profile');
                console.log(res.data.user)
                setUser(res.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du profil utilisateur :', error);
            }
        };
        fetchUserProfile();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
      try {
          e.preventDefault();

          const address = {
              region: profileData.region,
              department: profileData.department,
              city: profileData.city
          };

          const res = await api.put('/api/user/profile', {
              name: profileData.name,
              surname: profileData.surname,
              email: profileData.email,
              address
          });
          setUser(res.data.data);
          setUpdatingInfo(false);
      } catch (error) {
          console.error('Erreur lors de la mise à jour du profil :', error);
          setUpdatingInfo(false);
      }
  };


  return (
    <div className={styles.profileContainer}>
      {updatingInfo ? (
        <div className={styles.profileCard}>
          <h2 className={styles.editTitle}>Modifier mon profil</h2>
          <form className={styles.profileForm} onSubmit={handleProfileUpdate}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Prénom</label>
                <input 
                  type="text" 
                  id="name" 
                  defaultValue={user?.name} 
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="surname">Nom</label>
                <input 
                  type="text" 
                  id="surname" 
                  defaultValue={user?.surname} 
                  onChange={(e) => setProfileData({...profileData, surname: e.target.value})} 
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                defaultValue={user?.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="region">Région</label>
                <input 
                  type="text" 
                  id="region" 
                  defaultValue={user?.address?.region} 
                  onChange={(e) => setProfileData({...profileData, region: e.target.value})} 
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="department">Département</label>
                <input 
                  type="text" 
                  id="department" 
                  defaultValue={user?.address?.department} 
                  onChange={(e) => setProfileData({...profileData, department: e.target.value})} 
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">Ville</label>
              <input 
                type="text" 
                id="city" 
                defaultValue={user?.address?.city} 
                onChange={(e) => setProfileData({...profileData, city: e.target.value})} 
              />
            </div>

            <div className={styles.profileActions}>
              <button type="submit" className={styles.btnSave}>Enregistrer</button>
              <button 
                type="button" 
                className={styles.btnCancel} 
                onClick={() => setUpdatingInfo(false)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : user ? (
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <h1 className={styles.profileName}>
              <span className={styles.firstName}>{user.name}</span>
              <span className={styles.lastName}>{user.surname}</span>
            </h1>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>

          {user.address && (
            <div className={styles.profileSection}>
              <h3>Informations de localisation</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Région</span>
                  <span className={styles.infoValue}>{user.address.region || 'Non renseignée'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Département</span>
                  <span className={styles.infoValue}>{user.address.department || 'Non renseigné'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Ville</span>
                  <span className={styles.infoValue}>{user.address.city || 'Non renseignée'}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.profileActions}>
            <button className={styles.btnEdit} onClick={() => setUpdatingInfo(true)}>
              Modifier le profil
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.loading}>
          Chargement du profil...
        </div>
      )}
    </div>
  );
}