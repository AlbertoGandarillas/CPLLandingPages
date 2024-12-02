import { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/minified/introjs.min.css';

interface Step {
  title: string;
  element: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface UseIntroJSProps {
  steps: Step[];
  onComplete?: () => void;
}

export function useIntroJS({ steps, onComplete }: UseIntroJSProps) {
  useEffect(() => {
    const onboardingEnabled = localStorage.getItem('onboardingEnabled') !== 'false';
    if (onboardingEnabled) {
      const intro = introJs();
      
      // Add dark mode styles
      const style = document.createElement("style");
      style.textContent = `
        .introjs-tooltip {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
        }
        
        .introjs-tooltiptext {
          color: hsl(var(--foreground));
        }
        
        .introjs-arrow.top {
          border-bottom-color: hsl(var(--background));
        }
        
        .introjs-arrow.bottom {
          border-top-color: hsl(var(--background));
        }
        
        .introjs-button {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          border: 1px solid hsl(var(--border));
          text-shadow: none;
        }
        
        .introjs-button:hover {
          background-color: hsl(var(--accent));
        }
        
        .introjs-skipbutton {
          position: absolute;
          right: 50px;
          bottom: 10px;
          color: hsl(var(--muted-foreground));
          cursor: pointer;
        }
        
        .introjs-helperLayer {
          background-color: rgba(0, 0, 0, 0.5);
          border: 1px solid hsl(var(--border));
        }
        
        .introjs-tooltipReferenceLayer {
          background-color: transparent;
        }
        
        .introjs-helperNumberLayer {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: 1px solid hsl(var(--border));
        }
      `;
      document.head.appendChild(style);

      intro.setOptions({
        steps,
        showProgress: false,
        exitOnOverlayClick: false,
        showButtons: true,
        showBullets: false,
        doneLabel: "Finish",
      });

      intro.oncomplete(() => {
        localStorage.setItem("onboardingEnabled", "false");
        onComplete?.();
      });

      // Small delay to ensure DOM elements are ready
      setTimeout(() => {
        intro.start();
      }, 500);

      return () => {
        intro.exit(true);
        style.remove();
      };
    }
  }, [steps, onComplete]);
} 