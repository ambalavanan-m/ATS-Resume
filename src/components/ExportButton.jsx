import React, { useState } from 'react';
import { FileDown, ChevronDown, Check, FileJson, FileText, Code } from 'lucide-react';
import { jsPDF } from 'jspdf';

const ExportButton = ({ results }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const generateJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ATS-Analysis-${results.industry}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setShowOptions(false);
  };

  const generateMarkdown = () => {
    let md = `# ATS Resume Analysis Report: ${results.industry}\n\n`;
    md += `**Overall Score:** ${results.ats_score}%\n`;
    md += `**Format Score:** ${results.format_score}%\n`;
    md += `**Readability Score:** ${results.readability_score}%\n\n`;
    md += `## Summary\n${results.summary}\n\n`;
    
    if (results.strengths?.length) {
      md += `## Strengths\n`;
      results.strengths.forEach(s => md += `- ${s}\n`);
      md += `\n`;
    }
    
    if (results.suggestions?.length) {
      md += `## Suggestions\n`;
      results.suggestions.forEach(s => md += `- [${s.priority.toUpperCase()}] ${s.text}\n`);
      md += `\n`;
    }

    if (results.cover_letter) {
      md += `## AI Cover Letter\n\n${results.cover_letter}\n\n`;
    }

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `ATS-Analysis-${results.industry}.md`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setShowOptions(false);
  };

  const generatePDF = () => {
    setIsExporting(true);
    setShowOptions(false);
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxTextWidth = pageWidth - margin * 2;

      doc.setFontSize(22);
      doc.text(`ATS Resume Analysis: ${results.industry}`, margin, yPos);
      yPos += 15;

      doc.setFontSize(14);
      doc.text(`Overall Score: ${results.ats_score}%`, margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      const splitSummary = doc.splitTextToSize(`Summary: ${results.summary}`, maxTextWidth);
      doc.text(splitSummary, margin, yPos);
      yPos += (splitSummary.length * 6) + 10;

      if (results.strengths?.length) {
        doc.setFontSize(14);
        doc.text("Strengths:", margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        results.strengths.forEach(s => {
          const splitStrength = doc.splitTextToSize(`• ${s}`, maxTextWidth);
          // Check page break
          if (yPos + (splitStrength.length * 6) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(splitStrength, margin, yPos);
          yPos += (splitStrength.length * 6) + 2;
        });
        yPos += 5;
      }

      if (results.suggestions?.length) {
        // Check page break before suggestions
        if (yPos + 20 > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
        }
        doc.setFontSize(14);
        doc.text("Suggestions:", margin, yPos);
        yPos += 8;
        doc.setFontSize(12);
        results.suggestions.forEach(s => {
          const splitSugg = doc.splitTextToSize(`• [${s.priority.toUpperCase()}] ${s.text}`, maxTextWidth);
          if (yPos + (splitSugg.length * 6) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }
          doc.text(splitSugg, margin, yPos);
          yPos += (splitSugg.length * 6) + 2;
        });
        yPos += 5;
      }

      // We'll just do a basic PDF without every single tab to save space, but it's selectable.
      doc.save(`ATS-Analysis-${results.industry}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative z-40">
      <div className="flex items-center">
        <button
          onClick={generatePDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-l-lg text-sm font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileDown size={18} />
          )}
          <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
        </button>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="px-2 py-2 bg-accent/80 text-background rounded-r-lg border-l border-background/20 hover:bg-accent transition-all"
        >
          <ChevronDown size={18} />
        </button>
      </div>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1c2128] border border-[#30363d] rounded-xl shadow-2xl z-[100] overflow-hidden animate-fade-in">
          <button
            onClick={generatePDF}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center"
          >
            Export PDF (Selectable)
            <FileText size={14} className="text-accent" />
          </button>
          <button
            onClick={generateMarkdown}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center border-t border-[#30363d]"
          >
            Export Markdown
            <Code size={14} className="text-purple-400" />
          </button>
          <button
            onClick={generateJSON}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center border-t border-[#30363d]"
          >
            Export JSON
            <FileJson size={14} className="text-green-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
