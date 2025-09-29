import { ReactNode } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  FileText, 
  MessageSquare, 
  Settings, 
  Rocket,
  LogOut,
  DollarSign,
  Folder,
  PenTool
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { user, logout, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jet-black flex items-center justify-center">
        <div className="text-cloud-white">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Idea Engine', href: '/admin/ideas', icon: Lightbulb },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Blog', href: '/admin/blog', icon: PenTool },
    { name: 'Pricing', href: '/admin/pricing', icon: DollarSign },
    { name: 'Projects', href: '/admin/projects', icon: Folder },
    { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-jet-black">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-rocket-gray/10 border-r border-rocket-gray/20">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-rocket-gray/20">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-vapor-purple/20 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-vapor-purple" />
                </div>
                <span className="text-lg font-bold text-cloud-white font-['Architects_Daughter']">
                  Free Beer Studio
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive(item.href)
                          ? 'bg-vapor-purple/20 text-vapor-purple'
                          : 'text-rocket-gray hover:text-cloud-white hover:bg-rocket-gray/20'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* User section */}
              <div className="p-4 border-t border-rocket-gray/20">
                <div className="flex items-center mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-cloud-white">{user.email}</p>
                    <p className="text-xs text-rocket-gray">Admin</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="w-full border-rocket-gray text-rocket-gray hover:text-cloud-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
