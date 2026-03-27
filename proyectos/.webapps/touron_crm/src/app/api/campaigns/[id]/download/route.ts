import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { campaigns } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import PDFDocument from 'pdfkit';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const idStr = await params.id;
    const id = parseInt(idStr);

    if (!id) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const campaign = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, id),
    });

    if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Create a PDF document
    const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
    });

    // Create a buffer to store the PDF chunks
    const chunks: Buffer[] = [];

    // Use a promise to handle the stream collection
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // PDF Content
        // Header
        doc.fillColor('#0A192F').fontSize(24).text('BOLETÍN TÉCNICO TOURON', { align: 'center' });
        doc.moveDown();
        doc.fontSize(10).fillColor('#666666').text(`Fecha de Lanzamiento: ${new Date(campaign.releaseDate).toLocaleDateString('es-ES')}`, { align: 'right' });
        doc.text(`ID de Campaña: #BUL-${campaign.id.toString().padStart(4, '0')}`, { align: 'right' });
        doc.moveDown();

        // Separation line
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#0A192F').lineWidth(2).stroke();
        doc.moveDown(2);

        // Title
        doc.fillColor('#0A192F').fontSize(18).text(campaign.title, { underline: true });
        doc.moveDown();

        // Priority Badge
        const priorityColor = campaign.priority === 'Urgent' ? '#EF4444' : (campaign.priority === 'Safety' ? '#F97316' : '#3B82F6');
        const priorityLabel = campaign.priority === 'Urgent' ? 'URGENTE / ACCIÓN REQUERIDA' : (campaign.priority === 'Safety' ? 'ALERTA DE SEGURIDAD' : 'BOLETÍN DE RUTINA');

        doc.rect(50, doc.y, 250, 20).fill(priorityColor);
        doc.fillColor('#FFFFFF').fontSize(10).text(priorityLabel, 55, doc.y - 15);
        doc.moveDown(2);

        // Description text
        doc.fillColor('#333333').fontSize(12).text('DESCRIPCIÓN:', { stroke: true });
        doc.moveDown(0.5);
        doc.fontSize(11).text(campaign.description, { align: 'justify', lineGap: 5 });
        doc.moveDown(2);

        // Affected Products
        if (campaign.affectedProducts) {
            doc.fontSize(12).fillColor('#0A192F').text('PRODUCTOS AFECTADOS:', { stroke: true });
            doc.moveDown(0.5);
            doc.rect(50, doc.y, 500, 40).fill('#F8FAFC');
            doc.fillColor('#1E293B').fontSize(11).text(campaign.affectedProducts, 60, doc.y - 35, { width: 480 });
            doc.moveDown(2);
        }

        // Instructions Mockup
        doc.fillColor('#0A192F').fontSize(12).text('INSTRUCCIONES DE SERVICIO:', { stroke: true });
        doc.moveDown(0.5);
        doc.fillColor('#333333').fontSize(10).list([
            'Verificar número de serie del producto en el portal Dealer.',
            'Inspeccionar los componentes detallados en el diagrama técnico adjunto.',
            'Registrar la intervención en el sistema de garantías utilizando el código de campaña indicado.',
            'Contactar con el departamento técnico de Touron si se detectan anomalías adicionales.'
        ], { bulletRadius: 2 });

        // Footer
        const footerY = doc.page.height - 100;
        doc.fontSize(8).fillColor('#999999').text('Este documento es confidencial y para uso exclusivo de la red de concesionarios oficiales Touron.', 50, footerY, { align: 'center' });
        doc.text('Touron S.A. - Distribuidor Oficial Mercury Marine IBERIA', { align: 'center' });

        // Finalize the PDF
        doc.end();
    });

    // Return the PDF as a Response
    return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Boletin_Touron_${id}.pdf"`,
        },
    });
}
