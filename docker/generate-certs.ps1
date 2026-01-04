# SSL-Zertifikate für lokale Entwicklung generieren
#
# Dieses Skript erstellt selbst-signierte SSL-Zertifikate
# für die lokale Entwicklung mit HTTPS.
#
# Verwendung:
#   .\docker\generate-certs.ps1

# Verzeichnis erstellen
$certsDir = Join-Path $PSScriptRoot "certs"
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir | Out-Null
    Write-Host "Verzeichnis erstellt: $certsDir" -ForegroundColor Green
}

# Zertifikat-Dateipfade
$keyFile = Join-Path $certsDir "key.pem"
$certFile = Join-Path $certsDir "cert.pem"

# Prüfen ob OpenSSL installiert ist
if (-not (Get-Command openssl -ErrorAction SilentlyContinue)) {
    Write-Host "OpenSSL ist nicht installiert!" -ForegroundColor Red
    Write-Host "Installieren Sie OpenSSL oder verwenden Sie WSL." -ForegroundColor Yellow
    exit 1
}

# Selbst-signiertes Zertifikat generieren
Write-Host "Generiere SSL-Zertifikate..." -ForegroundColor Cyan

openssl req -x509 -newkey rsa:4096 `
    -keyout $keyFile `
    -out $certFile `
    -sha256 `
    -days 365 `
    -nodes `
    -subj "/C=DE/ST=Baden-Wuerttemberg/L=Karlsruhe/O=HKA/OU=SWE/CN=localhost" `
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

if ($LASTEXITCODE -eq 0) {
    Write-Host "SSL-Zertifikate erfolgreich erstellt!" -ForegroundColor Green
    Write-Host "  Key:  $keyFile" -ForegroundColor Gray
    Write-Host "  Cert: $certFile" -ForegroundColor Gray
    Write-Host ""
    Write-Host "HINWEIS: Da das Zertifikat selbst-signiert ist," -ForegroundColor Yellow
    Write-Host "         zeigt der Browser eine Sicherheitswarnung." -ForegroundColor Yellow
    Write-Host "         Dies ist für die lokale Entwicklung normal." -ForegroundColor Yellow
} else {
    Write-Host "Fehler beim Generieren der Zertifikate!" -ForegroundColor Red
    exit 1
}
