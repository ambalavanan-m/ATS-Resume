import React, { useState, useRef } from 'react';
import { FileDown, ChevronDown, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { createRoot } from 'react-dom/client';
import ReportTemplate from './ReportTemplate';

const ExportButton = ({ results }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const hiddenContainerRef = useRef(null);

  const generatePDF = async (theme) => {
    if (!results) return;
    setIsExporting(true);
    setShowOptions(false);

    try {
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Render the template into the container
      const root = createRoot(container);
      root.render(<ReportTemplate results={results} theme={theme} />);

      // Wait for rendering and fonts
      await new Promise(resolve => setTimeout(resolve, 800));

      const element = container.firstChild;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: theme === 'dark' ? '#0d1117' : '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ATS-Analysis-${theme.toUpperCase()}.pdf`);

      // Cleanup
      root.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF Export Error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportBoth = async () => {
     await generatePDF('dark');
     await generatePDF('light');
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={() => generatePDF('dark')}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-l-lg text-sm font-bold hover:bg-accent/90 transition-all disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileDown size={18} />
          )}
          <span>{isExporting ? 'Generating...' : 'Export Report'}</span>
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
            onClick={() => generatePDF('dark')}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center"
          >
            Dark Mode PDF
            <div className="w-2 h-2 rounded-full bg-accent" />
          </button>
          <button
            onClick={() => generatePDF('light')}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center border-t border-[#30363d]"
          >
            Light Mode PDF
            <div className="w-2 h-2 rounded-full bg-white" />
          </button>
          <button
            onClick={handleExportBoth}
            className="w-full px-4 py-3 text-left text-xs font-mono text-white hover:bg-accent/10 hover:text-accent flex justify-between items-center border-t border-[#30363d]"
          >
            Export Both (Multi-Theme)
            <div className="flex gap-0.5">
               <div className="w-2 h-2 rounded-full bg-accent" />
               <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
