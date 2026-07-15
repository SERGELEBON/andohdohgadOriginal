import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Mail, MailOpen, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
}

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-700', icon: Mail },
  read: { label: 'Lu', color: 'bg-gray-100 text-gray-700', icon: MailOpen },
  replied: { label: 'Répondu', color: 'bg-green-100 text-green-700', icon: MailOpen },
};

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.map(m =>
        m.id === id ? { ...m, status: 'read' as const } : m
      ));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      markAsRead(message.id);
    }
  };

  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">Messages</h1>
          <p className="text-gray-600">{stats.new} nouveau(x) message(s)</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-2xl font-bold text-dark">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Nouveaux</div>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Lus</div>
            <div className="text-2xl font-bold text-gray-600">{stats.read}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Répondus</div>
            <div className="text-2xl font-bold text-green-600">{stats.replied}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 space-y-2">
            {messages.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun message</p>
              </div>
            ) : (
              messages.map((msg) => {
                const StatusIcon = statusConfig[msg.status].icon;
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`bg-white rounded-lg p-4 border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary shadow-md'
                        : msg.status === 'new'
                        ? 'border-blue-200 hover:border-blue-300'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className="w-4 h-4 text-gray-400" />
                          <h3 className={`font-medium ${msg.status === 'new' ? 'text-dark' : 'text-gray-600'}`}>
                            {msg.full_name}
                          </h3>
                        </div>
                        <p className={`text-sm ${msg.status === 'new' ? 'font-medium text-dark' : 'text-gray-600'} truncate`}>
                          {msg.subject}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusConfig[msg.status].color}`}>
                        {statusConfig[msg.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-dark mb-2">{selectedMessage.subject}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>De : {selectedMessage.full_name}</span>
                        <span>•</span>
                        <span>{selectedMessage.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(selectedMessage.created_at).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <MailOpen className="w-4 h-4" />
                    Répondre par email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sélectionnez un message pour le lire</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
