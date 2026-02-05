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
                    <div>
                        <h2>Notifications</h2>
                    </div>
                    <div className={styles.headerActions}>
                        <button 
                            className={styles.closeButton}
                            onClick={() => setIsNotificationPanelOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <div className={styles.panelContent}>
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>🔔</span>
                        <p>Aucune notification</p>
                    </div>
                </div>
            </div>
        </>
    );
}