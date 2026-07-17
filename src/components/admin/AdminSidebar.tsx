import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Calendar,
  MessageSquare,
  Building2,
  FolderOpen,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: FileText, label: 'Blog', path: '/admin/blog' },
  { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
  { icon: Calendar, label: 'Rendez-vous', path: '/admin/appointments' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  { icon: Building2, label: 'Co-working', path: '/admin/coworking' },
  { icon: FolderOpen, label: 'Documents', path: '/admin/documents' },
  { icon: FileText, label: 'Achats docs', path: '/admin/docs' },
  { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[70px] lg:top-[80px] bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          collapsed ? 'w-0 lg:w-20' : 'w-64'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!collapsed && (
                <div>
                  <h2 className="font-semibold text-dark">Admin Panel</h2>
                  <p className="text-xs text-gray-500">{profile?.email}</p>
                </div>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 hover:bg-gray-100 rounded hidden lg:block"
              >
                <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-3 py-2.5 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={collapsed ? 'Déconnexion' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
