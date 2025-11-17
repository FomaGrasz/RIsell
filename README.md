# RIsell! - Book Resale Platform

A simple, elegant website for displaying and managing used book inventory organized by sections.

## Features

✨ **Dynamic Table Generation** - Tables are automatically generated from `data.json`
📚 **Organized by Sections** - Each section in the JSON creates its own table
🎨 **Modern Design** - Beautiful gradient backgrounds and responsive layout
📱 **Mobile Responsive** - Works great on all device sizes
🏷️ **Quality Badges** - Visual indicators for book condition (Excellent, Good, Fair, Poor)

## Project Structure

```
presito/
├── index.html       # Main HTML file
├── styles.css       # Styling and layout
├── script.js        # JavaScript for dynamic table rendering
├── data.json        # Book inventory data
└── README.md        # This file
```

## Data Format

The `data.json` file contains sections of books with the following structure:

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

## How to Use

1. **Open the website**: Open `index.html` in your web browser
2. **Add new books**: Edit `data.json` and add new book entries to any section
3. **Create new sections**: Add a new section object to the `sections` array in `data.json`
4. **Refresh the page**: The tables will automatically update when you refresh the browser

## Table Columns

- **Title** - Book title
- **ISBN** - ISBN-13 code
- **Year** - Publication year
- **Branch** - Book category or subject area
- **Quality** - Condition badge (Excellent/Good/Fair/Poor)
- **Price** - Selling price in euros (€)
- **Contact** - Seller contact information

## Customization

### Colors
Edit the color scheme in `styles.css`:
- Gradient colors in `background: linear-gradient()`
- Border colors and accent colors in theme variables

### Quality Badges
Modify quality styles in `styles.css`:
- `.quality-excellent` - Green
- `.quality-good` - Blue
- `.quality-fair` - Yellow
- `.quality-poor` - Red

### Layout
Adjust responsive breakpoints and spacing in `styles.css` media queries.

## Running Locally

If you want to run this with a local server:

### Using Python 3
```bash
python3 -m http.server 8000
```

### Using Node.js (http-server)
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern CSS and JavaScript)

## License

Free to use and modify for personal projects.
