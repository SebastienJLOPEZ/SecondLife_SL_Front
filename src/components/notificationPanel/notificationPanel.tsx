'use client';

import styles from './notificationPanel.module.css';

export default function NotificationPanel({ 
    setIsNotificationPanelOpen 
}: { 
    setIsNotificationPanelOpen: React.Dispatch<React.SetStateAction<boolean>> 
}) {

    return (
        <>
                    <div 
                        className={styles.overlay}
                        onClick={() => setIsNotificationPanelOpen(false)}
                    />
                    <div className={styles.notificationPanel}>
                        <div className={styles.panelHeader}>
                            <h2>Notifications</h2>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setIsNotificationPanelOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.panelContent}>
                            <div className={styles.notificationItem}>
                                <span className={styles.notificationIcon}>📦</span>
                                <div>
                                    <p className={styles.notificationTitle}>Nouvelle offre</p>
                                    <p className={styles.notificationText}>Jean a créé une offre de troc</p>
                                    <span className={styles.notificationTime}>Il y a 2h</span>
                                </div>
                            </div>
                            <div className={styles.notificationItem}>
                                <span className={styles.notificationIcon}>💬</span>
                                <div>
                                    <p className={styles.notificationTitle}>Nouveau message</p>
                                    <p className={styles.notificationText}>Marie vous a envoyé un message</p>
                                    <span className={styles.notificationTime}>Il y a 5h</span>
                                </div>
                            </div>
                            <div className={styles.notificationItem}>
                                <span className={styles.notificationIcon}>✅</span>
                                <div>
                                    <p className={styles.notificationTitle}>Échange accepté</p>
                                    <p className={styles.notificationText}>Votre proposition a été acceptée</p>
                                    <span className={styles.notificationTime}>Hier</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)
}