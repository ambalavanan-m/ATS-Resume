import React, { useState } from 'react';
import { Download, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExportButton = ({ elementId, fileName = 'ATS-Analysis-Report.pdf' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0d1117',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(fileName);
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-[#1c2128] border border-[#30363d] rounded-lg text-sm text-[#8b949e] hover:text-accent hover:border-accent transition-all disabled:opacity-50"
    >
      {isExporting ? (
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      ) : (
        <FileDown size={18} />
      )}
      <span>{isExporting ? 'Generating...' : 'Export PDF'}</span>
    </button>
  );
};

export default ExportButton;
