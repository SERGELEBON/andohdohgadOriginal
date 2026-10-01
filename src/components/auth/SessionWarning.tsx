import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface SessionWarningProps {
  show: boolean;
  onDismiss: () => void;
  onExtend: () => void;
}

export default function SessionWarning({ show, onDismiss, onExtend }: SessionWarningProps) {
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds

  useEffect(() => {
    if (!show) {
      setCountdown(120);
      return;
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-amber-500 p-6 max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">Session expirée bientôt</h3>
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Votre session sera automatiquement fermée dans{' '}
              <span className="font-semibold text-amber-600">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>{' '}
              en raison d'inactivité.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onExtend}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Rester connecté
              </button>
              <button
                onClick={onDismiss}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Ignorer
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 120) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
