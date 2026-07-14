import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Building2, Shield, LogOut, Calendar, FileText, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyAccount() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      coworking_client: 'bg-blue-100 text-blue-800',
      standard_client: 'bg-green-100 text-green-800',
      visitor: 'bg-gray-100 text-gray-800',
    };
    return badges[role as keyof typeof badges] || badges.visitor;
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrateur',
      coworking_client: 'Client Co-working',
      standard_client: 'Client Standard',
      visitor: 'Visiteur',
    };
    return labels[role as keyof typeof labels] || 'Visiteur';
  };

  return (
    <div className="min-h-screen bg-offwhite">
      <div className="bg-primary text-white py-16">
        <div className="container-lg">
          <h1 className="font-display text-3xl font-bold mb-2">Mon Compte</h1>
          <p className="text-white/80">Gérez vos informations et vos services</p>
        </div>
      </div>

      <div className="container-lg py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-semibold text-dark">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getRoleBadge(profile?.role || 'visitor')}`}>
                  {getRoleLabel(profile?.role || 'visitor')}
                </span>
              </div>

              <nav className="space-y-2">
                <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 text-primary font-medium">
                  <User className="w-5 h-5" />
                  Profil
                </a>
                {profile?.role === 'admin' && (
                  <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-body">
                    <Shield className="w-5 h-5" />
                    Administration
                  </a>
                )}
                {profile?.role === 'coworking_client' && (
                  <a href="/co-working" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 text-body">
                    <MapPin className="w-5 h-5" />
                    Mon Co-working
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-xl shadow-card p-8">
              <h2 className="font-display text-xl font-semibold text-dark mb-6">Informations personnelles</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-body mb-1">Email</p>
                    <p className="font-medium text-dark">{profile?.email}</p>
                  </div>
                </div>

                {profile?.phone && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-body mb-1">Téléphone</p>
                      <p className="font-medium text-dark">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile?.company_name && (
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-body mb-1">Entreprise</p>
                      <p className="font-medium text-dark">{profile.company_name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-body mb-1">Type de compte</p>
                    <p className="font-medium text-dark">{getRoleLabel(profile?.role || 'visitor')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-card p-8">
              <h2 className="font-display text-xl font-semibold text-dark mb-6">Actions rapides</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="/rendez-vous" className="flex items-center justify-center gap-2 btn-primary">
                  <Calendar className="w-5 h-5" />
                  Prendre rendez-vous
                </a>
                <a href="/documentation" className="flex items-center justify-center gap-2 btn-secondary">
                  <FileText className="w-5 h-5" />
                  Documentation
                </a>
                {profile?.role === 'coworking_client' && (
                  <a href="/co-working" className="flex items-center justify-center gap-2 btn-primary sm:col-span-2">
                    <MapPin className="w-5 h-5" />
                    Réserver un espace
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
