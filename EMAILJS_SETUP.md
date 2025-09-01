# EmailJS Setup für Effiprocess Kontaktformular

## Schritt-für-Schritt Anleitung:

### 1. EmailJS Account erstellen
- Gehe zu https://www.emailjs.com/
- Erstelle einen kostenlosen Account
- Bestätige deine E-Mail-Adresse

### 2. E-Mail Service konfigurieren
- Klicke auf "Add New Service"
- Wähle deinen E-Mail-Provider (Gmail, Outlook, etc.)
- Folge den Anweisungen zur Verbindung
- Notiere dir die **Service ID**

### 3. E-Mail Template erstellen
- Klicke auf "Create New Template"
- Verwende diese Template-Variablen:
  ```
  Von: {{from_name}} <{{from_email}}>
  Unternehmen: {{company}}
  Service-Interesse: {{service}}
  
  Nachricht:
  {{message}}
  ```
- Notiere dir die **Template ID**

### 4. Public Key kopieren
- Gehe zu "Account" → "General"
- Kopiere deinen **Public Key**

### 5. Konfiguration eintragen
Ersetze in `app.js` diese Werte:
```javascript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'DEINE_SERVICE_ID',
  TEMPLATE_ID: 'DEINE_TEMPLATE_ID',  
  PUBLIC_KEY: 'DEIN_PUBLIC_KEY'
};
```

### 6. Testen
- Öffne deine Website
- Fülle das Kontaktformular aus
- Prüfe dein E-Mail-Postfach

## Kostenlos bis 200 E-Mails/Monat
Das sollte für die meisten Websites ausreichen.