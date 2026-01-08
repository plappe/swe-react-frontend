/**
 * Pagination - Seitennavigation
 *
 * Zurück/Weiter-Buttons für Pagination mit deaktivierten Zuständen.
 */

import { Button } from 'react-bootstrap';

interface PaginationProps {
    currentPage: number;
    hasNextPage: boolean;
    loading: boolean;
    onPrevious: () => void;
    onNext: () => void;
}

export function Pagination({
    currentPage,
    hasNextPage,
    loading,
    onPrevious,
    onNext,
}: PaginationProps) {
    if (!hasNextPage && currentPage === 0) {
        return null;
    }

    return (
        <div className="mb-3 d-flex justify-content-end">
            <div className="d-flex gap-2">
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={onPrevious}
                    disabled={currentPage === 0 || loading}
                >
                    <i className="bi bi-chevron-left"></i> Zurück
                </Button>
                <span className="align-self-center px-2">Seite {currentPage + 1}</span>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={onNext}
                    disabled={!hasNextPage || loading}
                >
                    Weiter <i className="bi bi-chevron-right"></i>
                </Button>
            </div>
        </div>
    );
}
