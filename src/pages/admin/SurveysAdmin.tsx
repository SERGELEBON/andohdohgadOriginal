import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabaseClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { ClipboardList, Phone, Mail, Trash2 } from 'lucide-react';
import { SERVICE_REQUEST_LABELS, type ServiceRequestType } from '@/lib/supabase/submissions';

type RequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface ServiceRequest {
  id: string;
  survey_type: ServiceRequestType;
  form_data: Record<string, unknown> | null;
  name: string;
  email: string;
  phone: string;
  status: RequestStatus;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<RequestStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'En cours', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Traitée', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-700' },
};

// Libellés lisibles des champs enregistrés dans form_data
const FIELD_LABELS: Record<string, string> = {
  name: 'Nom', email: 'Email', phone: 'Téléphone', company: 'Entreprise', companyName: "Nom de l'entreprise",
  structure: 'Forme juridique', sector: "Secteur d'activité", capital: 'Capital', partnerCount: "Nombre d'associés",
  employeeCount: "Nombre d'employés", registrationAddress: 'Adresse de domiciliation', hasBusinessPlan: 'Business plan',
  serviceType: 'Type de service', urgency: 'Urgence', budget: 'Budget', rhNeed: 'Besoin RH', description: 'Description',
  spaceType: "Type d'espace", plan: 'Formule', message: 'Message',
};

const HIDDEN_FIELDS = new Set(['name', 'email', 'phone']);

export default function SurveysAdmin() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ServiceRequestType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
  const [selected, setSelected] = useState<ServiceRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching service requests:', error);
      setLoadError(error.message);
    } else {
      setRequests((data as ServiceRequest[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- chargement initial
    fetchRequests();
  }, [fetchRequests]);

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await supabase.from('surveys').update({ status }).eq('id', id);
    if (error) {
      alert('Erreur lors de la mise à jour');
      return;
    }
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Supprimer définitivement cette demande ?')) return;
    const { error } = await supabase.from('surveys').delete().eq('id', id);
    if (error) {
      alert('Erreur lors de la suppression');
      return;
    }
    setRequests((rs) => rs.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = requests.filter(
    (r) => (typeFilter === 'all' || r.survey_type === typeFilter) && (statusFilter === 'all' || r.status === statusFilter),
  );

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    in_progress: requests.filter((r) => r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 mt-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Demandes de service</h1>
          <p className="text-gray-600">
            Création d'entreprise, service spécifique, RH, domiciliation et co-working — {stats.pending} en attente
          </p>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Impossible de charger les demandes : {loadError}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, color: 'text-dark' },
            { label: 'En attente', value: stats.pending, color: 'text-amber-600' },
            { label: 'En cours', value: stats.in_progress, color: 'text-blue-600' },
            { label: 'Traitées', value: stats.completed, color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
            aria-label="Filtrer par type"
          >
            <option value="all">Tous les types</option>
            {Object.entries(SERVICE_REQUEST_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statusConfig).map(([v, c]) => (
              <option key={v} value={v}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Liste */}
          <div className="lg:col-span-2 space-y-2">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune demande</p>
              </div>
            ) : (
              filtered.map((r) => {
                const cfg = statusConfig[r.status] ?? statusConfig.pending;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelected(r)}
                    className={`w-full text-left bg-white rounded-lg p-4 border transition-all ${
                      selected?.id === r.id ? 'border-primary shadow-md' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="font-medium text-dark">{r.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{SERVICE_REQUEST_LABELS[r.survey_type] ?? r.survey_type}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(r.created_at).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(r.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Détail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                        {SERVICE_REQUEST_LABELS[selected.survey_type] ?? selected.survey_type}
                      </p>
                      <h2 className="text-xl font-bold text-dark mb-2">{selected.name}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-primary">
                          <Mail className="w-4 h-4" /> {selected.email}
                        </a>
                        <a href={`tel:${selected.phone}`} className="flex items-center gap-1 hover:text-primary">
                          <Phone className="w-4 h-4" /> {selected.phone}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRequest(selected.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      aria-label="Supprimer la demande"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <dl className="p-6 grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {Object.entries(selected.form_data ?? {})
                    .filter(([k, v]) => !HIDDEN_FIELDS.has(k) && v !== undefined && v !== null && v !== '')
                    .map(([k, v]) => (
                      <div key={k} className={k === 'description' || k === 'message' ? 'sm:col-span-2' : ''}>
                        <dt className="text-gray-500">{FIELD_LABELS[k] ?? k}</dt>
                        <dd className="text-dark whitespace-pre-wrap">{String(v)}</dd>
                      </div>
                    ))}
                </dl>

                <div className="p-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-gray-600">Statut :</span>
                  {(Object.keys(statusConfig) as RequestStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        selected.status === s ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                  <a
                    href={`https://wa.me/${selected.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto px-4 py-2 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:opacity-90"
                  >
                    Répondre sur WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 text-gray-500">
                Sélectionnez une demande pour voir le détail
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
