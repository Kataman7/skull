import { useEffect, useState } from 'react';

const env = import.meta.env.VITE_ENV || 'dev';

function AtmTabMonitor() {

    if (env === 'dev') return null; // Ne pas afficher le moniteur d'onglet en mode développement

    const [duplicateTab, setDuplicateTab] = useState(false);

    useEffect(() => {
        // Identifiant unique pour cette session
        const tabId = Math.random().toString(36).substring(2, 15);

        // Fonction pour vérifier si un autre onglet est déjà ouvert
        const checkForDuplicateTabs = () => {
            try {
                // Essayer de s'enregistrer comme l'onglet actif
                const currentTab = localStorage.getItem('skullActiveTab');
                const timestamp = Date.now();

                if (currentTab) {
                    try {
                        // Un autre onglet est déjà actif
                        const { id, time } = JSON.parse(currentTab);

                        // Vérifier si l'onglet enregistré est encore valide (moins de 10 secondes)
                        // Augmenté à 10 secondes pour plus de fiabilité
                        if (timestamp - time < 10000) {
                            if (id !== tabId) {
                                setDuplicateTab(true);
                                return;
                            }
                        } else {
                            // Entrée expirée, on peut la remplacer
                            localStorage.setItem('skullActiveTab', JSON.stringify({ id: tabId, time: timestamp }));
                        }
                    } catch (e) {
                        // En cas d'erreur de parsing, on réinitialise
                        localStorage.setItem('skullActiveTab', JSON.stringify({ id: tabId, time: timestamp }));
                    }
                } else {
                    // S'enregistrer comme l'onglet actif
                    localStorage.setItem('skullActiveTab', JSON.stringify({ id: tabId, time: timestamp }));
                }
            } catch (error) {
                console.error('Erreur lors de la vérification des onglets:', error);
            }
        };

        // Ajouter un gestionnaire d'événement pour la fermeture de l'onglet
        const handleBeforeUnload = () => {
            const currentTab = localStorage.getItem('skullActiveTab');
            if (currentTab) {
                try {
                    const { id } = JSON.parse(currentTab);
                    if (id === tabId) {
                        localStorage.removeItem('skullActiveTab');
                    }
                } catch (e) {
                    console.error('Erreur lors du nettoyage:', e);
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Vérifier immédiatement
        checkForDuplicateTabs();

        // Puis vérifier régulièrement
        const interval = setInterval(checkForDuplicateTabs, 2000); // Réduit à 2 secondes

        // Nettoyer au démontage
        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload();
        };
    }, []);

    // Afficher un message d'erreur si c'est un onglet en double
    if (duplicateTab) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                color: 'white',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h2 class="text-orange-300 text-lg">🔒 Warning</h2>
                <p>The Skull game is already open in another tab.</p>
                <p>To avoid any issues, please use only one tab at a time.</p>
            </div>
        );
    }

    return null;
}

export default AtmTabMonitor;