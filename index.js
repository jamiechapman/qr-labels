const fs = require('fs');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// ========================================
// CONFIGURATION CONSTANTS
// ========================================

// Starting sequence number
const SEQUENCE_START = 1;

// QR code format template - use {n} as placeholder for the number
// Examples:
//   "ITEM-{n}" will generate: ITEM-1, ITEM-2, ITEM-3, etc.
//   "{n}" will generate: 1, 2, 3, etc.
//   "PRD-{n}-2024" will generate: PRD-1-2024, PRD-2-2024, etc.
const QR_FORMAT = "ITEM-{n}";

// QR code size (square dimension in points)
const QR_SIZE = 40;

// Font size for the sequence number text
const TEXT_FONT_SIZE = 8;

// Offset for text below QR code (in points)
const TEXT_OFFSET_Y = 5;

// ========================================
// MAIN APPLICATION
// ========================================

async function generateQRLabels() {
  try {
    // Load the template
    const template = JSON.parse(fs.readFileSync('./template.json', 'utf8'));

    console.log(`Loaded template: ${template.template}`);
    console.log(`Total positions: ${template.grid.totalPositions}`);
    console.log(`Starting sequence: ${SEQUENCE_START}`);
    console.log(`QR format: ${QR_FORMAT}`);
    console.log('');

    // Create a PDF document
    const doc = new PDFDocument({
      size: [template.page.width, template.page.height],
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    // Pipe the PDF to a file
    const outputPath = 'qr-labels.pdf';
    doc.pipe(fs.createWriteStream(outputPath));

    // Process each position
    for (let i = 0; i < template.positions.length; i++) {
      const position = template.positions[i];
      const sequenceNumber = SEQUENCE_START + i;
      const qrContent = QR_FORMAT.replace('{n}', sequenceNumber);

      console.log(`Processing position ${position.id} (${position.label}): ${qrContent}`);

      // Generate QR code as data URL
      const qrDataUrl = await QRCode.toDataURL(qrContent, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: QR_SIZE * 4 // Generate at higher resolution for better quality
      });

      // Convert data URL to buffer
      const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

      // Calculate position to center the QR code in the cell
      const qrX = position.center.x - (QR_SIZE / 2);
      const qrY = position.center.y - (QR_SIZE / 2);

      // Draw the QR code
      doc.image(qrBuffer, qrX, qrY, {
        width: QR_SIZE,
        height: QR_SIZE
      });

      // Draw the sequence number text below the QR code
      const textY = qrY + QR_SIZE + TEXT_OFFSET_Y;

      doc.font('Courier-Bold')
         .fontSize(TEXT_FONT_SIZE)
         .text(sequenceNumber.toString(), qrX, textY, {
           width: QR_SIZE,
           align: 'center'
         });
    }

    // Finalize the PDF
    doc.end();

    console.log('');
    console.log(`✓ PDF generated successfully: ${outputPath}`);
    console.log(`✓ Generated ${template.positions.length} QR code labels`);
    console.log(`✓ Sequence range: ${SEQUENCE_START} to ${SEQUENCE_START + template.positions.length - 1}`);

  } catch (error) {
    console.error('Error generating QR labels:', error);
    process.exit(1);
  }
}

// Run the generator
generateQRLabels();
