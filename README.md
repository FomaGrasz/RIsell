# RIsell! - sistema per la rivendità scolastica di libri usati

una soluzione semplice per gestire la rivendita dei libri nelle scuole, senza bisogno di avere sistemi di login (e tutti i problemi di sicurezza dei dati)

## Features

✨ **Sistema (quasi) automatico** - le tabelle di vendita sono completate tramite `data.json`

✨ **Sistema di ricerca** - facilità la ricerca del libro necessario per titolo, isbn e sezione

📚 **In sezioni** - ogni sezione ha una sua tabella di vendita

🎨 **Design pulito e moderno** - con Colori non impattanti sull'occhio

🏷️ **intuitiva** - indicatori visivi aiutano l'utente a trovare il prodotto richiesto

📱 **Ottimizzato per telefono** - Funziona bene su tutti quanti i dispositivi in generale


## Project Structure

```
presito/
├── index.html       # Main HTML file
├── styles.css       # Styling and layout
├── script.js        # JavaScript for dynamic table rendering
├── data.json        # Book inventory data
└── README.md        # This file
```

## formato dei dati

il `data.json` usa la seguente struttura per la categorizzaizone delle sezioni e dei libri:

```json
{
  "sections": [
    {
      "name": "Section Name",
      "books": [
        {
          "title": "Book Title",
          "isbn": "ISBN-13 code",
          "year": 2025,
          "branch": "Book Category/Branch",
          "quality": "excellent|good|fair|poor",
          "price": 19.99,
          "contact": "Contact Name - Email - Phone"
        }
      ]
    }
  ]
}
```

## come vedere sul proprio dispositivo

1. eseguire il comando "cd (posizione della cartella di risell)" e poi "py -m http.server 8000 " questo creera un server locale visibile solo a voi
2. **visualizzare il sito**: aprite "http://localhost:8000/" nel browser
3. **modificare i libri e le sezioni**: modificando il `data.json`   
4. **Refresh**: le tabelle verranno aggiornate
   
## colonne

- **titolo** - Book title
- **ISBN** - codice ISBN a 13 caratteri
- **Anno** - dell'anno di frequenza
- **categoria** - Materia
- **qualità** - Condition badge (Excellent/Good/Fair/Poor)
- **Prezzo** - Selling price in euros (€)
- **Contatto** - Seller contact information

## Customizzazione

### Colori
potete cambiare i colori in `styles.css`:


### colori della qualità
Modificali in `styles.css`:
- `.quality-excellent` - verde
- `.quality-good` - blu
- `.quality-fair` - giallo
- `.quality-poor` - rosso

### Layout
è tutto modificabile in `styles.css`. la spaziatura può essere ridefinita-

## Compatibilità

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support

### bottone di vendita
L'unico in grado di postare i libri in vendita è chi ha accesso al file 'data.json'. vi consiglio di collegare il bottone a un form google/microsoft, dalla quale poi li approvate e li trasferite sul sito.

### raccolta dati
il sito non raccoglie nessun dato nella sua versione attuale. è comunque vivamente consigliato compilare un informativa
sul trattamento della privacy e collegarla nel file 'index.html' nell'apposita sezione.

## Licenza
Libero uso di qualsiasi componente che troviate nella repository. Detto onestamente, ho usato in gran parte chatgpt per velocizzarmi il lavoro.
Se riutilizzate papale papale fatemelo sapere e datemi i crediti :).

per qualsiasi domanda, siete liberi di contattarmi
