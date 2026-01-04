import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

/**
 * ESLint Flat Configuration (ESLint 9+)
 *
 * ESLint ist ein "Linter" - ein Werkzeug das Code analysiert und:
 * - Fehler findet (z.B. undefined Variablen)
 * - Best Practices erzwingt
 * - Code-Stil konsistent hält
 *
 * Diese "Flat Config" ist das neue Format ab ESLint 9.
 * Statt .eslintrc.json verwendet man jetzt eslint.config.js
 */
export default tseslint.config(
    // Welche Dateien ignoriert werden sollen
    {
        ignores: ['dist', 'node_modules', 'playwright-report', 'test-results', 'tests/**/*'],
    },

    // Basis-Konfiguration für alle Dateien
    {
        // Erweitert empfohlene Regelsets
        extends: [
            // ESLint Basis-Regeln
            js.configs.recommended,
            // TypeScript-spezifische Regeln
            ...tseslint.configs.recommended,
            // Deaktiviert Regeln die mit Prettier kollidieren
            eslintConfigPrettier,
        ],

        // Welche Dateien diese Konfiguration betrifft
        files: ['**/*.{ts,tsx}'],

        // Sprach-Optionen
        languageOptions: {
            ecmaVersion: 2024,
            globals: {
                // Browser-Globals (window, document, etc.)
                ...globals.browser,
            },
        },

        // Plugins hinzufügen
        plugins: {
            // React-spezifische Regeln
            react,
            // React Hooks Regeln (sehr wichtig!)
            'react-hooks': reactHooks,
            // React Refresh für Hot Module Replacement
            'react-refresh': reactRefresh,
        },

        // Regel-Konfiguration
        rules: {
            // ============================================
            // React Hooks Regeln
            // ============================================

            // Erzwingt korrekten Dependency-Array in useEffect, useMemo, etc.
            ...reactHooks.configs.recommended.rules,

            // ============================================
            // React Refresh Regeln
            // ============================================

            // Warnt wenn Komponenten nicht hot-reload-fähig sind
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // ============================================
            // TypeScript Regeln
            // ============================================

            // Erlaubt explizites 'any' (mit Warnung statt Fehler)
            '@typescript-eslint/no-explicit-any': 'warn',

            // Verbietet ungenutzte Variablen (außer die mit _ beginnen)
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],

            // ============================================
            // Allgemeine Regeln
            // ============================================

            // Keine console.log im Production Code (warn statt error)
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            // Keine debugger Statements
            'no-debugger': 'error',
        },

        // React-spezifische Einstellungen
        settings: {
            react: {
                // Automatische React-Version Erkennung
                version: 'detect',
            },
        },
    },
);
