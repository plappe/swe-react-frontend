/**
 * CreateBookPage - Seite zum Erstellen neuer Bücher
 *
 * Nur für Admins zugänglich. Bietet ein Formular mit Validierung
 * zum Anlegen neuer Bücher über die GraphQL API.
 */

import { useState, FormEvent, useEffect } from 'react';
import { Container, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { apolloClient } from '../graphql';
import { ERSTELLE_BUCH } from '../graphql/mutations';
import { Buchart } from '../types';
import {
    BasicInfoFields,
    PriceFields,
    MetadataFields,
    FormButtons,
    FormAlerts,
} from '../components/book';
import { parseErrorMessage } from '../utils/errorParser';

/** GraphQL Typen für die Buch-Erstellung */
interface TitelInput {
    titel: string;
    untertitel?: string;
}

interface BuchInput {
    isbn: string;
    rating: number;
    art: Buchart;
    preis: number;
    rabatt?: number;
    lieferbar: boolean;
    datum?: string;
    homepage?: string;
    schlagwoerter?: string[];
    titel: TitelInput;
}

interface CreateBuchData {
    create: {
        id: string;
    };
}

interface CreateBuchVars {
    input: BuchInput;
}

export function CreateBookPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const isAdmin = isAuthenticated && user?.roles?.includes('admin');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [isbn, setIsbn] = useState('');
    const [titel, setTitel] = useState('');
    const [untertitel, setUntertitel] = useState('');
    const [art, setArt] = useState<Buchart | ''>('');
    const [rating, setRating] = useState(0);
    const [preis, setPreis] = useState('');
    const [rabatt, setRabatt] = useState('');
    const [lieferbar, setLieferbar] = useState(true);
    const [datum, setDatum] = useState('');
    const [homepage, setHomepage] = useState('');
    const [schlagwoerterInput, setSchlagwoerterInput] = useState('');
    const [schlagwoerter, setSchlagwoerter] = useState<string[]>([]);

    /** Nicht-Admins zur Startseite umleiten */
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const handleAddSchlagwort = () => {
        const trimmed = schlagwoerterInput.trim();
        if (trimmed && !schlagwoerter.includes(trimmed)) {
            setSchlagwoerter([...schlagwoerter, trimmed]);
            setSchlagwoerterInput('');
        }
    };

    const handleRemoveSchlagwort = (wort: string) => {
        setSchlagwoerter(schlagwoerter.filter((w) => w !== wort));
    };

    /** ISBN Validierung: 10 oder 13 Ziffern */
    const validateIsbn = () => {
        if (!isbn.trim()) {
            setFieldErrors((prev) => ({ ...prev, isbn: 'ISBN ist ein Pflichtfeld.' }));
        } else {
            const cleanIsbn = isbn.replace(/[-\s]/g, '');
            const isValidLength = cleanIsbn.length === 10 || cleanIsbn.length === 13;
            const isValidChars = /^[\dX]+$/i.test(cleanIsbn);

            if (!isValidLength || !isValidChars) {
                setFieldErrors((prev) => ({
                    ...prev,
                    isbn: 'ISBN muss eine gültige ISBN-10 (10 Ziffern) oder ISBN-13 (13 Ziffern) sein.',
                }));
            } else {
                setFieldErrors((prev) => {
                    const { isbn: _isbn, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const validateTitel = () => {
        if (!titel.trim()) {
            setFieldErrors((prev) => ({ ...prev, titel: 'Titel ist ein Pflichtfeld.' }));
        } else {
            setFieldErrors((prev) => {
                const { titel: _titel, ...rest } = prev;
                return rest;
            });
        }
    };

    /** Preis muss positiv sein */
    const validatePreis = () => {
        if (!preis) {
            setFieldErrors((prev) => ({ ...prev, preis: 'Preis ist ein Pflichtfeld.' }));
        } else {
            const preisFloat = parseFloat(preis);
            if (isNaN(preisFloat) || preisFloat <= 0) {
                setFieldErrors((prev) => ({
                    ...prev,
                    preis: 'Preis muss eine positive Zahl sein.',
                }));
            } else {
                setFieldErrors((prev) => {
                    const { preis: _preis, ...rest } = prev;
                    return rest;
                });
            }
        }
    };

    const validateHomepage = () => {
        if (homepage && homepage.trim()) {
            const urlPattern = /^https?:\/\/.+/;
            if (!urlPattern.test(homepage)) {
                setFieldErrors((prev) => ({
                    ...prev,
                    homepage: 'Homepage muss eine gültige URL sein (z.B. https://beispiel.de).',
                }));
            } else {
                setFieldErrors((prev) => {
                    const { homepage: _homepage, ...rest } = prev;
                    return rest;
                });
            }
        } else {
            setFieldErrors((prev) => {
                const { homepage: _homepage, ...rest } = prev;
                return rest;
            });
        }
    };

    /** Buchart ist Pflichtfeld */
    const validateArt = () => {
        if (!art) {
            setFieldErrors((prev) => ({ ...prev, art: 'Buchart ist ein Pflichtfeld.' }));
        } else {
            setFieldErrors((prev) => {
                const { art: _art, ...rest } = prev;
                return rest;
            });
        }
    };

    /** Formular absenden und Buch erstellen */
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!isbn || !titel || !preis || !art) {
                throw new Error('ISBN, Titel, Preis und Buchart sind Pflichtfelder');
            }

            const preisFloat = parseFloat(preis);
            if (isNaN(preisFloat) || preisFloat < 0) {
                throw new Error('Preis muss eine positive Zahl sein');
            }

            let rabattFloat = 0;
            if (rabatt) {
                rabattFloat = parseFloat(rabatt);
                if (isNaN(rabattFloat) || rabattFloat < 0 || rabattFloat > 1) {
                    throw new Error('Rabatt muss zwischen 0 und 1 liegen (z.B. 0.1 für 10%)');
                }
            }

            let datumISO: string | undefined = undefined;
            if (datum) {
                datumISO = `${datum}T00:00:00.000Z`;
            }

            /** GraphQL Mutation Input */
            const input: BuchInput = {
                isbn,
                titel: {
                    titel,
                    untertitel: untertitel || undefined,
                },
                art,
                rating,
                preis: preisFloat,
                rabatt: rabattFloat || undefined,
                lieferbar,
                datum: datumISO,
                homepage: homepage || undefined,
                schlagwoerter: schlagwoerter.length > 0 ? schlagwoerter : undefined,
            };

            const result = await apolloClient.mutate<CreateBuchData, CreateBuchVars>({
                mutation: ERSTELLE_BUCH,
                variables: { input },
            });

            if (result.data?.create?.id) {
                setSuccess(true);
                setIsbn('');
                setTitel('');
                setUntertitel('');
                setArt('');
                setRating(0);
                setPreis('');
                setRabatt('');
                setLieferbar(true);
                setDatum('');
                setHomepage('');
                setSchlagwoerter([]);
                setFieldErrors({});
            }
        } catch (err) {
            console.error('Create error:', err);
            const errorMessage =
                err instanceof Error
                    ? parseErrorMessage(err)
                    : 'Ein unbekannter Fehler ist aufgetreten';
            setError(errorMessage);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

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
