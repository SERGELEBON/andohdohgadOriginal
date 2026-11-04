import { AlertTriangle } from 'lucide-react';

interface Props {
  whatsappUrl: string;
  onRetry?: () => void;
}

/** Affiché quand la base n'a pas confirmé l'enregistrement : la demande n'est PAS reçue. */
export default function SubmitErrorBox({ whatsappUrl, onRetry }: Props) {
  return (
    <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="space-y-3">
          <p className="font-semibold text-red-700">Votre demande n'a pas pu être envoyée.</p>
          <p className="text-red-700">
            Un problème technique nous empêche de l'enregistrer. Pour être sûr que nous la recevions,
            envoyez-la-nous directement sur WhatsApp (votre message est déjà pré-rempli) ou réessayez.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 font-medium text-white hover:opacity-90"
            >
              Envoyer via WhatsApp
            </a>
            {onRetry && (
              <button type="button" onClick={onRetry} className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-100">
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
