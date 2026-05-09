'use client';
import React from 'react';

// Renders the Mermaid diagram using the mermaid.ink rendering service,
// same approach as WorkflowModal so the style is consistent.
interface MermaidDiagramProps {
  chartString: string;
  className?: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chartString, className = '' }) => {
  let styled = chartString;
  const boxStyles = `
    classDef default fill:#f8fafc,stroke:#6366f1,stroke-width:2px,color:#0f172a,rx:10px,ry:10px,font-family:sans-serif;
    linkStyle default stroke:#a5b4fc,stroke-width:2px;
  `;

  if (styled.includes('flowchart LR')) {
    styled = styled.replace('flowchart LR', 'flowchart LR' + boxStyles);
  } else if (styled.includes('graph TD')) {
    styled = styled.replace('graph TD', 'graph TD' + boxStyles);
  } else if (styled.includes('graph LR')) {
    styled = styled.replace('graph LR', 'graph LR' + boxStyles);
  }

  const encoded = btoa(unescape(encodeURIComponent(styled)));

  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <img
        src={`https://mermaid.ink/img/${encoded}`}
        alt="Workflow Diagram"
        className="max-w-full h-auto object-contain"
      />
    </div>
  );
};
