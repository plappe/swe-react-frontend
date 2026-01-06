/**
 * Create Book Page Component
 *
 * Ermöglicht Admins das Erstellen neuer Bücher.
 * Nur für eingeloggte Admins zugänglich.
 */

import { useEffect } from 'react';
import { Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import {
    BasicInfoFields,
    PriceFields,
    MetadataFields,
    FormButtons,
    FormAlerts,
} from '../components/book';
import { useBookForm } from '../hooks/useBookForm';

export function CreateBookPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && user?.roles?.includes('admin');

    const {
        loading,
        error,
        success,
        fieldErrors,
        isbn,
        setIsbn,
        titel,
        setTitel,
        untertitel,
        setUntertitel,
        art,
        setArt,
        rating,
        setRating,
        preis,
        setPreis,
        rabatt,
        setRabatt,
        lieferbar,
        setLieferbar,
        datum,
        setDatum,
        homepage,
        setHomepage,
        schlagwoerterInput,
        setSchlagwoerterInput,
        schlagwoerter,
        handleAddSchlagwort,
        handleRemoveSchlagwort,
        validateIsbn,
        validateTitel,
        validatePreis,
        validateHomepage,
        validateArt,
        handleSubmit,
    } = useBookForm();

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) {
        return null;
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Neues Buch erstellen</h2>

            <Card className="shadow-sm">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <BasicInfoFields
                            isbn={isbn}
                            setIsbn={setIsbn}
                            titel={titel}
                            setTitel={setTitel}
                            untertitel={untertitel}
                            setUntertitel={setUntertitel}
                            art={art}
                            setArt={setArt}
                            rating={rating}
                            setRating={setRating}
                            fieldErrors={fieldErrors}
                            onIsbnBlur={validateIsbn}
                            onTitelBlur={validateTitel}
                            onArtBlur={validateArt}
                        />

                        <PriceFields
                            preis={preis}
                            setPreis={setPreis}
                            rabatt={rabatt}
                            setRabatt={setRabatt}
                            lieferbar={lieferbar}
                            setLieferbar={setLieferbar}
                            datum={datum}
                            setDatum={setDatum}
                            fieldErrors={fieldErrors}
                            onPreisBlur={validatePreis}
                        />

                        <MetadataFields
                            homepage={homepage}
                            setHomepage={setHomepage}
                            schlagwoerterInput={schlagwoerterInput}
                            setSchlagwoerterInput={setSchlagwoerterInput}
                            schlagwoerter={schlagwoerter}
                            onAddSchlagwort={handleAddSchlagwort}
                            onRemoveSchlagwort={handleRemoveSchlagwort}
                            fieldErrors={fieldErrors}
                            onHomepageBlur={validateHomepage}
                        />

                        <FormButtons loading={loading} onCancel={() => navigate('/')} />
                    </Form>
                </Card.Body>
            </Card>

            <FormAlerts success={success} error={error} />
        </Container>
    );
}
