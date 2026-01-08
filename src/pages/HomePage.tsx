/**
 * Home Page
 *
 * Die Startseite der Anwendung.
 */

import { Container } from 'react-bootstrap';
import { useAuth } from '../auth';
import { HeroSection, SearchCard, LoginPrompt } from '../components/home';

export function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <Container className="py-5">
            <HeroSection />
            <SearchCard />
            {!isAuthenticated && <LoginPrompt />}
        </Container>
    );
}
