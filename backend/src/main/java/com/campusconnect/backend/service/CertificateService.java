package com.campusconnect.backend.service;

import com.campusconnect.backend.model.Event;
import com.campusconnect.backend.model.Registration;
import com.campusconnect.backend.model.User;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CertificateService {

    private static final String CERTIFICATE_DIR = "certificates";

    public String generateCertificate(Registration registration) {
        if (registration == null || registration.getId() == null) {
            throw new IllegalArgumentException("Registration and Registration ID must not be null");
        }

        try {
            Path dirPath = Paths.get(CERTIFICATE_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename = "certificate_" + registration.getId() + ".pdf";
            File pdfFile = dirPath.resolve(filename).toFile();

            // A4 in Landscape orientation
            Document document = new Document(PageSize.A4.rotate(), 50, 50, 40, 40);
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(pdfFile));
            document.open();

            // Dimensions for landscape A4
            float pageWidth = PageSize.A4.getHeight();
            float pageHeight = PageSize.A4.getWidth();

            // Draw decorative double border
            PdfContentByte canvas = writer.getDirectContent();
            
            // Outer Navy Blue border
            canvas.setColorStroke(new Color(30, 58, 138));
            canvas.setLineWidth(4f);
            canvas.rectangle(20, 20, pageWidth - 40, pageHeight - 40);
            canvas.stroke();

            // Inner Gold border
            canvas.setColorStroke(new Color(202, 138, 4));
            canvas.setLineWidth(1.5f);
            canvas.rectangle(26, 26, pageWidth - 52, pageHeight - 52);
            canvas.stroke();

            // Extract info
            User user = registration.getUser();
            Event event = registration.getEvent();

            String studentName = (user != null && user.getName() != null) ? user.getName() : "Student";
            String eventTitle = (event != null && event.getTitle() != null) ? event.getTitle() : "Campus Event";
            
            String eventDateStr = "N/A";
            if (event != null && event.getEventDate() != null) {
                eventDateStr = event.getEventDate().format(DateTimeFormatter.ofPattern("MMMM d, yyyy"));
            }

            // Fonts
            Font brandFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Font.BOLD, new Color(202, 138, 4));
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, Font.BOLD, new Color(30, 58, 138));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 13, Font.ITALIC, new Color(100, 116, 139));
            Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, Font.BOLD, new Color(15, 23, 42));
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 14, Font.NORMAL, new Color(51, 65, 85));
            Font clubFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 12, Font.ITALIC, new Color(71, 85, 105));
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Font.NORMAL, new Color(148, 163, 184));

            // Content paragraphs
            Paragraph emptyTop = new Paragraph(" ", FontFactory.getFont(FontFactory.HELVETICA, 10));
            document.add(emptyTop);

            Paragraph brand = new Paragraph("CAMPUSCONNECT", brandFont);
            brand.setAlignment(Element.ALIGN_CENTER);
            brand.setSpacingAfter(6);
            document.add(brand);

            Paragraph title = new Paragraph("Certificate of Participation", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(12);
            document.add(title);

            Paragraph presentationText = new Paragraph("This is proudly presented to", subtitleFont);
            presentationText.setAlignment(Element.ALIGN_CENTER);
            presentationText.setSpacingAfter(10);
            document.add(presentationText);

            Paragraph namePara = new Paragraph(studentName, nameFont);
            namePara.setAlignment(Element.ALIGN_CENTER);
            namePara.setSpacingAfter(14);
            document.add(namePara);

            String certBodyText = "This is to certify that " + studentName + " has successfully participated in "
                    + eventTitle + " held on " + eventDateStr + ".";
            Paragraph body = new Paragraph(certBodyText, bodyFont);
            body.setAlignment(Element.ALIGN_CENTER);
            body.setLeading(22);
            body.setSpacingAfter(14);
            document.add(body);

            if (event != null && event.getClubName() != null && !event.getClubName().isBlank()) {
                Paragraph club = new Paragraph("Organized by " + event.getClubName(), clubFont);
                club.setAlignment(Element.ALIGN_CENTER);
                club.setSpacingAfter(20);
                document.add(club);
            }

            Paragraph footer = new Paragraph(
                    "Certificate ID: CC-" + registration.getId() + " • Issued by CampusConnect Platform",
                    footerFont
            );
            footer.setAlignment(Element.ALIGN_CENTER);
            footer.setSpacingBefore(16);
            document.add(footer);

            document.close();

            return "/certificates/" + filename;
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Failed to generate certificate: " + e.getMessage(), e);
        }
    }
}
