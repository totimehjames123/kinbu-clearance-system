import React from 'react';
import jsPDF from 'jspdf';
import { MdDownload } from 'react-icons/md';

const ClearanceForm = ({ student }) => {
  const handleDownload = () => {
    if (!student) {
      console.error('Student data is missing.');
      return;
    }

    const transactions = student.transactions || []; // Default to an empty array if missing

    const doc = new jsPDF();

    // Add logo image using a public URL
    const logoURL = './images/logo.jpg'; // Replace with your image URL
    const imgWidth = 70; // Set the desired width
    const imgHeight = 50; // Set the desired height
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgX = (pageWidth - imgWidth) / 2;

    doc.addImage(logoURL, 'JPEG', imgX, 10, imgWidth, imgHeight);
    doc.setFont('Helvetica'); // Use Helvetica font

    // Center business info
    doc.setFontSize(18);
    const businessText = 'Kinbu Senior High Technical School';
    const businessTextWidth = doc.getTextWidth(businessText);
    const businessTextX = (pageWidth - businessTextWidth) / 2;
    doc.text(businessText, businessTextX, imgHeight + 20);

    // Add additional business info
    doc.setFontSize(12);
    const additionalInfo = [
      'Greater Accra Region at Tudu - Accra of Accra Metro district.',
      '030 342 5632',
      'kinbuseniorhightechnicalschool@gmail.com',
    ];
    additionalInfo.forEach((text, index) => {
      const textWidth = doc.getTextWidth(text);
      const textX = (pageWidth - textWidth) / 2;
      doc.text(text, textX, imgHeight + 30 + (index * 10));
    });

    // Add student info
    doc.text(`Student Name: ${student.fullName || 'N/A'}`, 10, imgHeight + 70);
    doc.text(`Student Class: ${student.yearLevel || 'N/A'}`, 10, imgHeight + 80);
    doc.text(`Department: ${student.programme || 'N/A'}`, 10, imgHeight + 90);

    // Add clearance form details
    doc.setFontSize(16);
    doc.text(`Clearance Form #${student._id || 'N/A'}`, 10, imgHeight + 110);
    doc.text(`Date: ${new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date())}`, 10, imgHeight + 120);

    // Table header with vertical headings for "Clearance Officers" and "Clearance Status"
    doc.setFontSize(12);
    const headerX = 10;
    const headerY = imgHeight + 140;
    const verticalOffset = 10;
    const clearanceOfficersHeader = 'Clearance Officers';
    const clearanceStatusHeader = 'Clearance Status';
    
    // Draw headers
    doc.text(clearanceOfficersHeader, headerX, headerY);
    doc.text(clearanceStatusHeader, pageWidth - 50, headerY); // Adjust 50 to fit the status column width

    doc.setFontSize(10);

    // Add the clearance officers and statuses
    const clearanceOfficers = ['HOD', 'Librarian', 'Bookshop', 'Administrator'];
    const statuses = [
      student.HODApprovedStatus ? 'Cleared' : 'Not Cleared',
      student.libraryStatus || 'N/A',
      student.bookshopStatus || 'N/A',
      student.adminStatus || 'N/A'
    ];

    clearanceOfficers.forEach((officer, index) => {
      const yOffset = headerY + (index + 1) * verticalOffset;
      doc.text(officer, headerX, yOffset);
    });

    // Calculate position for statuses (rightmost side)
    const statusColumnWidth = 50; // Width of the statuses column
    const statusX = pageWidth - statusColumnWidth - 10; // 10 units from the right edge

    // Add statuses
    statuses.forEach((status, index) => {
      const yOffset = headerY + (index + 1) * verticalOffset;
      doc.text(status, statusX, yOffset);
    });

    // Table body
    const startY = headerY + (clearanceOfficers.length + 1) * verticalOffset + 10;
    transactions.forEach((transaction, index) => {
      doc.text(transaction._id || '-', 10, startY + (index * 10));
      doc.text(transaction.bookName || '-', 60, startY + (index * 10));
      doc.text(transaction.bookNumber || '-', 110, startY + (index * 10));
      doc.text(transaction.dateTaken ? new Intl.DateTimeFormat('en-US').format(new Date(transaction.dateTaken)) : '-', 160, startY + (index * 10));
      doc.text(transaction.dateReturned ? new Intl.DateTimeFormat('en-US').format(new Date(transaction.dateReturned)) : '-', 210, startY + (index * 10));
    });

    // Footer with school stamp and signature
    const footerY = startY + (transactions.length * 10) + 20;
    const stampWidth = 50; // Width of the stamp image placeholder
    const signatureWidth = 60; // Width of the signature placeholder

    // Placeholder for the school stamp
    doc.setFontSize(12);
    doc.text('School Stamp:', 10, footerY);
    doc.rect(10, footerY + 5, stampWidth, 20); // Draw rectangle for stamp

    // Placeholder for the signature
    doc.text('Signature:', 10 + stampWidth + 10, footerY); // 10 units space between stamp and signature
    doc.rect(10 + stampWidth + 10, footerY + 5, signatureWidth, 20); // Draw rectangle for signature

    // Footer text
    doc.text('Thank you for your cooperation! This Clearance Form is generated automatically.', 10, footerY + 40);

    doc.save(`ClearanceForm_${student._id || 'N/A'}.pdf`);
  };

  return (
    <MdDownload
      onClick={handleDownload}
      className='w-10 h-10 bg-gray-100 text-blue-500 hover:text-blue-300 transition-all duration-500 rounded-full p-2'
      title="Download Clearance Form"
    />
  );
};

export default ClearanceForm;
