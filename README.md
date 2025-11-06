# QR Code Label Generator

A Node.js application that generates sequential QR codes on a PDF using the Herma 4386 label template. Perfect for creating inventory labels, asset tags, or any other sequential QR code labels.

## Features

- Generates 96 QR code labels per page (8 columns x 12 rows)
- Configurable starting sequence number
- Customizable QR code format with variable substitution
- Square QR codes centered in each circular label position
- Bold Courier font for sequence numbers below each QR code
- Uses official Herma 4386 template specifications (A4 format)

## Installation

```bash
npm install
```

## Usage

Run the application to generate a PDF:

```bash
npm start
```

This will create a file named `qr-labels.pdf` in the current directory.

## Configuration

Edit the constants at the top of `index.js` to customize your labels:

### SEQUENCE_START
Starting sequence number for the labels.

```javascript
const SEQUENCE_START = 1;  // Starts at 1
```

### QR_FORMAT
Template string for QR code content. Use `{n}` as a placeholder for the sequence number.

Examples:
```javascript
const QR_FORMAT = "ITEM-{n}";        // Generates: ITEM-1, ITEM-2, ITEM-3, etc.
const QR_FORMAT = "{n}";              // Generates: 1, 2, 3, etc.
const QR_FORMAT = "PRD-{n}-2024";    // Generates: PRD-1-2024, PRD-2-2024, etc.
const QR_FORMAT = "https://example.com/item/{n}";  // URL QR codes
```

### Other Settings

- `QR_SIZE`: Size of the QR code square in points (default: 40)
- `TEXT_FONT_SIZE`: Font size for the sequence number (default: 8)
- `TEXT_OFFSET_Y`: Vertical spacing between QR code and text (default: 5)

## Template Information

This application uses the **Herma 4386** label template:
- Format: A4 (596 x 842 points)
- Grid: 8 columns × 12 rows = 96 labels per page
- Label type: Circular (diameter: 60.96 points / ~21.5mm)
- Cell size: 66.1 × 64.97 points

## Output

The generated PDF contains:
- 96 QR code labels positioned according to the Herma 4386 template
- Each QR code is a square centered in the circular label area
- Sequence number displayed below each QR code in bold Courier font

## Example

With the default settings:
- `SEQUENCE_START = 1`
- `QR_FORMAT = "ITEM-{n}"`

The first three labels will contain QR codes for:
1. ITEM-1
2. ITEM-2
3. ITEM-3

And the sequence continues through ITEM-96.

## Files

- `index.js` - Main application file
- `template.json` - Herma 4386 label template specifications
- `package.json` - Node.js dependencies
- `qr-labels.pdf` - Generated output (created when you run the app)

## Requirements

- Node.js (v12 or higher recommended)
- npm

## Dependencies

- `pdfkit` - PDF generation
- `qrcode` - QR code generation

## License

ISC
