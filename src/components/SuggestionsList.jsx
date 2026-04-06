import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: <AlertCircle size={16} /> };
      case 'medium': return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', icon: <AlertTriangle size={16} /> };
      case 'low': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: <Info size={16} /> };
      default: return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', icon: <Info size={16} /> };
    }
  };

  return (
    <div className="space-y-3">
      {sortedSuggestions.map((s, i) => {
        const styles = getPriorityStyles(s.priority);
        return (
          <div key={i} className={`p-4 rounded-lg border ${styles.bg} ${styles.border} flex gap-3 items-start animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
            <span className={styles.text}>{styles.icon}</span>
            <div>
              <p className={`text-sm ${styles.text} font-bold lowercase`}>{s.priority} priority</p>
              <p className="text-sm text-white/80">{s.text}</p>
            </div>
          </div>
        );
      })}
      {suggestions.length === 0 && <p className="text-sm text-gray-500 italic">No suggestions; looking good!</p>}
    </div>
  );
};

export default SuggestionsList;
