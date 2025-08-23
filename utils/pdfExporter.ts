import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import type { AnalysisResult } from '../types';

const PAGE_MARGIN = 15;
const FONT_SIZES = {
  H1: 18,
  H2: 14,
  H3: 12,
  BODY: 10,
  SMALL: 8,
};

export const generatePdfReport = async (result: AnalysisResult, erdElement: HTMLElement | null) => {
    const doc = new jspdf('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let cursorY = PAGE_MARGIN;

    const addPageIfNeeded = (height: number) => {
        if (cursorY + height > pageHeight - PAGE_MARGIN) {
            doc.addPage();
            cursorY = PAGE_MARGIN;
        }
    };

    const addTitle = (text: string) => {
        addPageIfNeeded(20);
        doc.setFontSize(FONT_SIZES.H1);
        doc.setTextColor(44, 62, 80);
        doc.text(text, pageWidth / 2, cursorY, { align: 'center' });
        cursorY += 20;
    };

    const addSectionHeader = (text: string) => {
        addPageIfNeeded(15);
        doc.setFontSize(FONT_SIZES.H2);
        doc.setTextColor(239, 68, 68);
        doc.text(text, PAGE_MARGIN, cursorY);
        cursorY += 6;
        doc.setDrawColor(229, 231, 235);
        doc.line(PAGE_MARGIN, cursorY, pageWidth - PAGE_MARGIN, cursorY);
        cursorY += 8;
    };

    const addBodyText = (text: string, indent = 0) => {
        if (!text) return;
        doc.setFontSize(FONT_SIZES.BODY);
        doc.setTextColor(82, 91, 102);
        const lines = doc.splitTextToSize(text, pageWidth - (PAGE_MARGIN * 2) - indent);
        const textHeight = lines.length * 5; // Approximate height
        addPageIfNeeded(textHeight);
        doc.text(lines, PAGE_MARGIN + indent, cursorY);
        cursorY += textHeight;
    };

    addTitle("OutSystems AI Analysis Report");

    if (result.businessSummary) {
        addSectionHeader('Business Summary');
        addBodyText(result.businessSummary);
        cursorY += 5;
    }
    
    if (result.architecture?.layers) {
        addSectionHeader('Architecture Canvas');
        result.architecture.layers.forEach(layer => {
            addPageIfNeeded(15);
            doc.setFontSize(FONT_SIZES.H3);
            doc.setTextColor(51, 65, 85);
            doc.text(layer.name, PAGE_MARGIN, cursorY);
            cursorY += 5;
            addBodyText(layer.description, 5);
            addBodyText(`Modules: ${layer.modules.join(', ')}`, 5);
            cursorY += 5;
        });
    }

    if (erdElement) {
        addSectionHeader('ERD Diagram');
        try {
            const canvas = await html2canvas(erdElement, { scale: 2, backgroundColor: '#FFFFFF', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - (PAGE_MARGIN * 2);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            addPageIfNeeded(imgHeight + 10);
            doc.addImage(imgData, 'PNG', PAGE_MARGIN, cursorY, imgWidth, imgHeight, undefined, 'FAST');
            cursorY += imgHeight + 10;
        } catch (e) {
            console.error("Failed to render ERD canvas to PDF", e);
            addBodyText("Error: Could not render the ERD diagram.");
        }
    }
    
    if (result.entities?.length > 0) {
        addSectionHeader("Entities");
        result.entities.forEach(entity => {
            addPageIfNeeded(15);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(entity.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(entity.description, 5); cursorY += 2;
            doc.setFont('courier', 'normal');
            entity.attributes.forEach(attr => {
                const key = attr.isPrimaryKey ? '(PK)' : (attr.isForeignKey ? '(FK)' : '');
                addBodyText(`- ${attr.name.padEnd(20)} ${attr.dataType.padEnd(15)} ${key}`, 10);
            });
            doc.setFont('helvetica', 'normal');
            cursorY += 5;
        });
    }
    
    if (result.staticEntities?.length > 0) {
        addSectionHeader("Static Entities");
        result.staticEntities.forEach(entity => {
            addPageIfNeeded(15);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(entity.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(entity.description, 5); cursorY += 2;
            doc.setFont('courier', 'normal');
            const headers = entity.attributes.map(a => a.name.padEnd(15)).join('');
            addBodyText(headers, 10);
            addBodyText('-'.repeat(headers.length), 10);
            entity.records.forEach(record => {
                const row = entity.attributes.map(attr => String(record[attr.name] ?? '').padEnd(15)).join('');
                addBodyText(row, 10);
            });
            doc.setFont('helvetica', 'normal');
            cursorY += 5;
        });
    }

    if (result.asynchronousProcesses && (result.asynchronousProcesses.timers?.length || result.asynchronousProcesses.bptProcesses?.length)) {
       addSectionHeader("Asynchronous Processes");
       if(result.asynchronousProcesses.timers?.length) {
           doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
           doc.text("Timers", PAGE_MARGIN, cursorY); cursorY += 7;
            result.asynchronousProcesses.timers.forEach(timer => {
                addPageIfNeeded(15);
                addBodyText(timer.name, 5);
                addBodyText(`Description: ${timer.description}`, 10);
                addBodyText(`Schedule: ${timer.schedule}`, 10);
                cursorY += 5;
            });
       }
       if(result.asynchronousProcesses.bptProcesses?.length) {
           doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
           doc.text("BPT Processes", PAGE_MARGIN, cursorY); cursorY += 7;
            result.asynchronousProcesses.bptProcesses.forEach(process => {
                addPageIfNeeded(20);
                addBodyText(process.name, 5);
                addBodyText(`Trigger: ${process.trigger}`, 10);
                addBodyText("Steps:", 10);
                process.steps.forEach(step => addBodyText(`- ${step}`, 15));
                cursorY += 5;
            });
       }
   }

    if(result.thirdPartyRecommendations?.length > 0) {
        addSectionHeader("Third-Party Recommendations");
        result.thirdPartyRecommendations.forEach(rec => {
            addPageIfNeeded(15);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(rec.serviceName, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(`Use Case: ${rec.useCase}`, 5);
            addBodyText(rec.recommendation, 5);
            cursorY += 5;
        });
    }

    if (result.endpoints?.length > 0) {
        addSectionHeader("API Endpoints");
        result.endpoints.forEach(endpoint => {
            addPageIfNeeded(20);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(endpoint.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(endpoint.description, 5);
            addBodyText(`Method: ${endpoint.method}`, 5);
            addBodyText(`Path: ${endpoint.path}`, 5);
            if(endpoint.parameters.length > 0) {
              addBodyText(`Parameters: ${endpoint.parameters.join(', ')}`, 5);
            }
            cursorY += 5;
        });
    }

    if (result.roles?.length > 0) {
        addSectionHeader("Roles & Permissions");
         result.roles.forEach(role => {
            addPageIfNeeded(10);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(role.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(role.description, 5);
            cursorY += 5;
         });
    }

    if (result.pages?.length > 0) {
        addSectionHeader("Pages");
         result.pages.forEach(page => {
            addPageIfNeeded(10);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(page.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(page.description, 5);
            addBodyText(`Primary Role: ${page.role}`, 5);
            cursorY += 5;
         });
    }

    if (result.siteProperties?.length > 0) {
        addSectionHeader("Site Properties");
         result.siteProperties.forEach(prop => {
            addPageIfNeeded(10);
            doc.setFontSize(FONT_SIZES.H3); doc.setTextColor(51, 65, 85);
            doc.text(prop.name, PAGE_MARGIN, cursorY); cursorY += 5;
            addBodyText(prop.description, 5);
            addBodyText(`Data Type: ${prop.dataType} | Default: ${prop.defaultValue}`, 5);
            cursorY += 5;
         });
    }

    // Finalize: add page numbers
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(FONT_SIZES.SMALL);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - PAGE_MARGIN, pageHeight - 10, { align: 'right' });
    }

    doc.save('OutSystems-AI-Analysis.pdf');
};