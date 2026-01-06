import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Konfiguration
 *
 * Playwright ist ein Framework für End-to-End (E2E) Tests.
 * E2E-Tests simulieren echte Benutzerinteraktionen im Browser.
 *
 * Dokumentation: https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
    // Verzeichnis mit den Test-Dateien
    testDir: './tests/e2e',

    // Verzeichnis für Test-Ergebnisse (Screenshots, Videos, etc.)
    outputDir: './test-results',

    // Maximale Wartezeit für jeden Test (30 Sekunden)
    timeout: 30_000,

    // Maximale Wartezeit für expect() Assertions (5 Sekunden)
    expect: {
        timeout: 5_000,
    },

    // Tests parallel ausführen
    fullyParallel: true,

    // Keine Wiederholungen bei Fehlern (für CI: 2)
    retries: process.env.CI ? 2 : 0,

    // Anzahl der parallelen Worker
    workers: process.env.CI ? 1 : undefined,

    // Reporter für Testergebnisse
    reporter: [
        // HTML-Report mit Screenshots
        ['html', { outputFolder: './playwright-report' }],
        // Konsolen-Output
        ['list'],
    ],

    // Gemeinsame Einstellungen für alle Tests
    use: {
        // Basis-URL für relative Pfade (z.B. page.goto('/login'))
        baseURL: 'http://localhost:5173',

        // Screenshot bei Fehler
        screenshot: 'only-on-failure',

        // Video bei Fehler aufnehmen
        video: 'on-first-retry',

        // Trace bei Fehler aufzeichnen (hilfreich für Debugging)
        trace: 'on-first-retry',

        // Browser-Kontext Optionen
        contextOptions: {
            // Ignoriere HTTPS-Zertifikatsfehler (für lokale Entwicklung)
            ignoreHTTPSErrors: true,
        },
    },

    // Browser-Projekte (verschiedene Browser testen)
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        // Webkit nur wenn benötigt (langsamer)
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    // Lokalen Entwicklungsserver starten vor den Tests
    webServer: {
        command: 'pnpm dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
