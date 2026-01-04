/**
 * Haupt-App Komponente
 *
 * Diese Komponente definiert das Layout und die Routen der Anwendung.
 * Sie ist der Einstiegspunkt für alle sichtbaren Komponenten.
 */

import { Routes, Route } from 'react-router-dom';

// Layout-Komponenten
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Seiten-Komponenten (werden später implementiert)
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SearchPage } from './pages/SearchPage';
import { DetailPage } from './pages/DetailPage';
import { CreatePage } from './pages/CreatePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Geschützte Route Komponente
import { ProtectedRoute } from './auth/ProtectedRoute';

/**
 * App Component
 *
 * React Router v6 verwendet <Routes> und <Route> Komponenten:
 * - <Routes> ist der Container für alle Routen
 * - <Route> definiert eine einzelne Route mit path und element
 * - path="*" ist der Catch-All für 404-Seiten
 */
function App() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header ist auf allen Seiten sichtbar */}
            <Header />

            {/* Hauptinhalt - flex-grow-1 füllt den verfügbaren Platz */}
            <main className="flex-grow-1">
                <Routes>
                    {/* Öffentliche Routen */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/suche" element={<SearchPage />} />
                    <Route path="/buch/:id" element={<DetailPage />} />

                    {/* Geschützte Routen - nur für eingeloggte Benutzer */}
                    <Route
                        path="/neu"
                        element={
                            <ProtectedRoute>
                                <CreatePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 - Seite nicht gefunden */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            {/* Footer ist auf allen Seiten sichtbar */}
            <Footer />
        </div>
    );
}

export default App;
