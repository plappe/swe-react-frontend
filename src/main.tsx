/**
 * Main Entry Point der React-Anwendung
 *
 * Diese Datei ist der Startpunkt der gesamten Anwendung.
 * Hier werden alle globalen Provider (Context) eingerichtet.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';

// Apollo Client für GraphQL
import { apolloClient } from './graphql/client';

// Auth Provider für Keycloak (Direct Access)
import { DirectAuthProvider } from './auth/DirectAuthProvider';

// Haupt-App Komponente
import App from './App';

// Globale Styles
import './styles/index.css';

// Bootstrap CSS importieren
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap Icons für Avatar und Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

/**
 * React 18 verwendet createRoot statt ReactDOM.render
 *
 * Die Struktur der Provider ist wichtig:
 * 1. StrictMode - Entwicklungshelfer (findet potenzielle Probleme)
 * 2. ApolloProvider - Macht GraphQL-Client verfügbar
 * 3. BrowserRouter - Ermöglicht Client-Side Routing
 * 4. AuthProvider - Verwaltet Keycloak-Authentifizierung
 * 5. App - Die eigentliche Anwendung
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found. Check index.html');
}

createRoot(rootElement).render(
    <StrictMode>
        {/* ApolloProvider macht den GraphQL-Client in der gesamten App verfügbar */}
        <ApolloProvider client={apolloClient}>
            {/* BrowserRouter ermöglicht URL-basiertes Routing */}
            <BrowserRouter>
                {/* DirectAuthProvider verwaltet Login-Status mit Direct Access Grants */}
                <DirectAuthProvider>
                    <App />
                </DirectAuthProvider>
            </BrowserRouter>
        </ApolloProvider>
    </StrictMode>,
);
