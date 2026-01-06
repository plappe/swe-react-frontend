/**
 * Apollo Client Konfiguration
 *
 * Apollo Client ist ein vollständiger GraphQL-Client der:
 * - Queries und Mutations sendet
 * - Caching automatisch verwaltet
 * - Loading/Error States bereitstellt
 *
 * Dokumentation: https://www.apollographql.com/docs/react/
 */

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Umgebungsvariablen für die API-URL
const GRAPHQL_URI = import.meta.env.VITE_GRAPHQL_URI || '/graphql';

/**
 * Custom Fetch mit Auth Header
 *
 * In Apollo Client 4.x ist der empfohlene Weg, Auth-Header
 * über eine custom fetch-Funktion hinzuzufügen.
 */
const customFetch: typeof fetch = (uri, options) => {
    const token = localStorage.getItem('auth_token');
    const headers = new Headers(options?.headers);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(uri, {
        ...options,
        headers,
    });
};

/**
 * HTTP Link
 *
 * Definiert die Verbindung zum GraphQL-Server.
 * credentials: 'include' sendet Cookies mit (wichtig für CORS)
 */
const httpLink = new HttpLink({
    uri: GRAPHQL_URI,
    credentials: 'include',
    fetch: customFetch,
});

/**
 * InMemoryCache
 *
 * Apollo's Caching-Strategie:
 * - Speichert Query-Ergebnisse im Speicher
 * - Vermeidet unnötige Netzwerk-Anfragen
 * - Aktualisiert automatisch bei Mutations
 *
 * typePolicies definiert wie bestimmte Typen gecacht werden:
 * - keyFields: Welche Felder als ID verwendet werden
 * - merge: Wie neue Daten mit gecachten Daten zusammengeführt werden
 */
const cache = new InMemoryCache({
    typePolicies: {
        // Buch wird anhand der 'id' identifiziert
        Buch: {
            keyFields: ['id'],
        },
        // Query-spezifische Caching-Regeln
        Query: {
            fields: {
                // Pagination: Neue Ergebnisse werden angehängt
                buecher: {
                    // merge kombiniert gecachte mit neuen Daten
                    merge(_existing: unknown, incoming: unknown) {
                        return incoming;
                    },
                },
            },
        },
    },
});

/**
 * Apollo Client Instance
 */
export const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    // Standard Query-Optionen
    defaultOptions: {
        watchQuery: {
            // 'cache-and-network': Zeigt gecachte Daten sofort,
            // aktualisiert dann vom Server
            fetchPolicy: 'cache-and-network',
        },
    },
});
