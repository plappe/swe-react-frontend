import { useState, FormEvent } from 'react';
import { apolloClient } from '../graphql';
import { ERSTELLE_BUCH } from '../graphql/mutations';
import { Buchart } from '../types';
import { parseErrorMessage } from '../utils/errorParser';

interface TitelInput {
    titel: string;
    untertitel?: string;
}

interface AbbildungInput {
    beschriftung: string;
    contentType: string;
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
    abbildungen?: AbbildungInput[];
}

interface CreateBuchData {
    create: {
        id: string;
    };
}

interface CreateBuchVars {
    input: BuchInput;
}

export const useBookForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Form state
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

    // Add schlagwort
    const handleAddSchlagwort = () => {
        const trimmed = schlagwoerterInput.trim();
        if (trimmed && !schlagwoerter.includes(trimmed)) {
            setSchlagwoerter([...schlagwoerter, trimmed]);
            setSchlagwoerterInput('');
        }
    };

    // Remove schlagwort
    const handleRemoveSchlagwort = (wort: string) => {
        setSchlagwoerter(schlagwoerter.filter((w) => w !== wort));
    };

    // Field validation handlers
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
                    isbn: 'ISBN muss eine gültige ISBN-10 (10 Ziffern) oder ISBN-13 (13 Ziffern) sein. Bindestriche sind erlaubt.',
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

    const resetForm = () => {
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
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Validate required fields
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

            // Convert date to ISO-8601 DateTime format if provided
            let datumISO: string | undefined = undefined;
            if (datum) {
                datumISO = `${datum}T00:00:00.000Z`;
            }

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
                resetForm();
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

    return {
        // State
        loading,
        error,
        success,
        fieldErrors,
        // Form fields
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
        // Handlers
        handleAddSchlagwort,
        handleRemoveSchlagwort,
        validateIsbn,
        validateTitel,
        validatePreis,
        validateHomepage,
        validateArt,
        handleSubmit,
    };
};
