import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Users, Calendar, FileText, MessageSquare, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle,
  FileEdit, Settings, BarChart3, Activity, Zap
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  pendingAppointments: number;
  newSurveys: number;
  newMessages: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  lastMonthRevenue: number;
  newUsersThisMonth: number;
}

interface RecentActivity {
  id: string;
  type: 'appointment' | 'message' | 'survey' | 'purchase';
  title: string;
  description: string;
  time: string;
  status: 'pending' | 'completed' | 'new';
}

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingAppointments: 0,
    newSurveys: 0,
    newMessages: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    lastMonthRevenue: 0,
    newUsersThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      const [
        { count: usersCount },
        { count: appointmentsCount },
        { count: surveysCount },
        { count: messagesCount },
        { data: purchases },
        { count: subsCount },
        { data: lastMonthPurchases },
        { count: newUsersCount },
        { data: recentAppointments },
        { data: recentMessages }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('surveys').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('documentation_purchases').select('amount_paid').eq('payment_status', 'completed').gte('created_at', startOfMonth.toISOString()),
        supabase.from('coworking_subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('documentation_purchases').select('amount_paid').eq('payment_status', 'completed').gte('created_at', startOfLastMonth.toISOString()).lte('created_at', endOfLastMonth.toISOString()),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()).neq('role', 'admin'),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(3)
      ]);

      const revenue = purchases?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;
      const lastRevenue = lastMonthPurchases?.reduce((sum, p) => sum + parseFloat(p.amount_paid), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        pendingAppointments: appointmentsCount || 0,
        newSurveys: surveysCount || 0,
        newMessages: messagesCount || 0,
        monthlyRevenue: revenue,
        activeSubscriptions: subsCount || 0,
        lastMonthRevenue: lastRevenue,
        newUsersThisMonth: newUsersCount || 0,
      });

      // Combine recent activity
      const activities: RecentActivity[] = [
        ...((recentAppointments || []).map(a => ({
          id: a.id,
          type: 'appointment' as const,
          title: `Nouveau RDV - ${a.first_name} ${a.last_name}`,
          description: a.message || 'Rendez-vous en attente',
          time: new Date(a.created_at).toLocaleString('fr-FR'),
          status: a.status
        }))),
        ...((recentMessages || []).map(m => ({
          id: m.id,
          type: 'message' as const,
          title: `Message de ${m.name}`,
          description: m.message?.substring(0, 60) + '...',
          time: new Date(m.created_at).toLocaleString('fr-FR'),
          status: m.status
        })))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueGrowth = stats.lastMonthRevenue > 0
    ? ((stats.monthlyRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary via-purple-700 to-primary py-8 px-6 lg:px-8 mb-8 mt-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  Dashboard Pro
                </h1>
                <p className="text-white/90 text-lg">Bienvenue, <span className="font-semibold">{profile?.first_name || 'Admin'}</span> 👋</p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/admin/settings" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
          {/* Quick Stats - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Utilisateurs"
              value={stats.totalUsers}
              subValue={`+${stats.newUsersThisMonth} ce mois`}
              color="blue"
              trend="up"
              href="/admin/users"
            />
            <StatCard
              icon={<DollarSign className="w-6 h-6" />}
              label="Revenus du mois"
              value={`${stats.monthlyRevenue.toLocaleString()} F`}
              subValue={`${Number(revenueGrowth) >= 0 ? '+' : ''}${revenueGrowth}% vs mois dernier`}
              color="emerald"
              trend={Number(revenueGrowth) >= 0 ? 'up' : 'down'}
              href="/admin/docs"
            />
            <StatCard
              icon={<Calendar className="w-6 h-6" />}
              label="RDV en attente"
              value={stats.pendingAppointments}
              subValue="À traiter"
              color="amber"
              badge={stats.pendingAppointments > 0}
              href="/admin/appointments"
            />
            <StatCard
              icon={<MessageSquare className="w-6 h-6" />}
              label="Messages non lus"
              value={stats.newMessages}
              subValue="Nécessite attention"
              color="purple"
              badge={stats.newMessages > 0}
              href="/admin/messages"
            />
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Abonnements Actifs</p>
                    <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
                  </div>
                </div>
                <Link to="/admin/coworking" className="text-white/90 hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-white/80">Co-working & Domiciliation</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Sondages Nouveaux</p>
                    <p className="text-3xl font-bold">{stats.newSurveys}</p>
                  </div>
                </div>
                <Link to="/admin/surveys" className="text-white/90 hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-white/80">À analyser et traiter</p>
              </div>
            </div>
          </div>

          {/* Recent Activity - Full Width */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activité Récente
              </h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">Tout voir</button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'appointment' ? 'bg-amber-100 text-amber-600' :
                        activity.type === 'message' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'survey' ? 'bg-purple-100 text-purple-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        {activity.type === 'appointment' ? <Calendar className="w-5 h-5" /> :
                         activity.type === 'message' ? <MessageSquare className="w-5 h-5" /> :
                         activity.type === 'survey' ? <FileText className="w-5 h-5" /> :
                         <DollarSign className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark mb-1">{activity.title}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                      <div>
                        {activity.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <AlertCircle className="w-3 h-3" />
                            En attente
                          </span>
                        )}
                        {activity.status === 'new' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subValue?: string;
  color: string;
  trend?: 'up' | 'down';
  badge?: boolean;
  href?: string;
}

function StatCard({ icon, label, value, subValue, color, trend, badge, href }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    cyan: 'bg-cyan-100 text-cyan-600',
  };

  const content = (
    <>
      {badge && (
        <div className="absolute top-3 right-3">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{label}</h3>
      <p className="text-3xl font-bold text-dark mb-1">{value}</p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </>
  );

  if (href) {
    return (
      <Link to={href} className="block bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all relative overflow-hidden group cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all relative overflow-hidden group">
      {content}
    </div>
  );
}
