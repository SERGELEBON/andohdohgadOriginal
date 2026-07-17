import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { FileText, Plus, Edit, Trash2, Eye, Download, Search } from 'lucide-react';
import { useAdminDocuments } from '@/hooks/useDocuments';
import DocumentForm, { type DocumentFormData } from '@/components/admin/DocumentForm';
import type { Document } from '@/hooks/useDocuments';

export default function DocumentsManagement() {
  const { documents, loading, createDocument, updateDocument, deleteDocument, refetch } = useAdminDocuments();

  const [showForm, setShowForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleCreate = () => {
    setEditingDocument(null);
    setShowForm(true);
  };

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setShowForm(true);
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${doc.translations?.find(t => t.language === 'fr')?.title}" ?`)) {
      return;
    }

    const result = await deleteDocument(doc.id);

    if (result.success) {
      alert('Document supprimé avec succès');
    } else {
      alert(`Erreur: ${result.error}`);
    }
  };

  const handleSubmit = async (data: DocumentFormData) => {
    if (editingDocument) {
      // Mise à jour
      const { translations, ...docData } = data;
      const result = await updateDocument(editingDocument.id, docData, translations);

      if (result.success) {
        alert('Document mis à jour avec succès');
        setShowForm(false);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } else {
      // Création
      const { translations, ...docData } = data;
      const result = await createDocument(docData, translations);

      if (result.success) {
        alert('Document créé avec succès');
        setShowForm(false);
      } else {
        alert(`Erreur: ${result.error}`);
      }
    }
  };

  // Filtrage
  const filteredDocuments = documents.filter(doc => {
    const frTranslation = doc.translations?.find(t => t.language === 'fr');
    const searchLower = search.toLowerCase();

    const matchSearch = !search ||
      frTranslation?.title.toLowerCase().includes(searchLower) ||
      frTranslation?.description.toLowerCase().includes(searchLower);

    const matchCategory = filterCategory === 'all' || doc.doc_type === filterCategory;
    const matchStatus = filterStatus === 'all' || doc.status === filterStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  // Stats
  const stats = {
    total: documents.length,
    active: documents.filter(d => d.status === 'active').length,
    draft: documents.filter(d => d.status === 'draft').length,
    totalSales: documents.reduce((sum, d) => sum + (d.purchase_count || 0), 0),
  };

  const categoryLabels: Record<string, string> = {
    guides: 'Guides',
    fiscaux: 'Fiscaux',
    modeles: 'Modèles',
    notes: 'Notes',
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
    active: { label: 'Actif', color: 'bg-green-100 text-green-700' },
    archived: { label: 'Archivé', color: 'bg-amber-100 text-amber-700' },
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark mb-2 flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" />
              Gestion des Documents
            </h1>
            <p className="text-gray-600">{documents.length} document(s) au total</p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2 px-5 py-2.5"
          >
            <Plus className="w-5 h-5" />
            Nouveau document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-dark">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-green-100">
            <div className="text-sm text-gray-600 mb-1">Actifs</div>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Brouillons</div>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </div>

          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-sm p-5 text-white">
            <div className="text-sm mb-1">Ventes totales</div>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filtre catégorie */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Toutes catégories</option>
            <option value="guides">Guides</option>
            <option value="fiscaux">Fiscaux</option>
            <option value="modeles">Modèles</option>
            <option value="notes">Notes</option>
          </select>

          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">Tous statuts</option>
            <option value="draft">Brouillon</option>
            <option value="active">Actif</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Document</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Catégorie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Prix</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ventes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Aucun document trouvé
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => {
                  const frTranslation = doc.translations?.find(t => t.language === 'fr');
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-dark">
                            {frTranslation?.title || 'Sans titre'}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {frTranslation?.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {categoryLabels[doc.doc_type]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-dark">{doc.price?.toLocaleString()} F</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{doc.purchase_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusLabels[doc.status]?.color}`}>
                          {statusLabels[doc.status]?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire Modal */}
      {showForm && (
        <DocumentForm
          document={editingDocument}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </AdminLayout>
  );
}
