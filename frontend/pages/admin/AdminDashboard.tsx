import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, FileText, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminLayout from '../../components/layout/AdminLayout';
import { useBackend } from '../../hooks/useBackend';

export default function AdminDashboard() {
  const backend = useBackend();
  
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => backend.admin.getDashboard(),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-cloud-white font-['Architects_Daughter']">
            Dashboard
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-rocket-gray/10 border-rocket-gray/20 animate-pulse">
                <CardHeader className="h-20"></CardHeader>
                <CardContent className="h-16"></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const kpis = dashboardData?.kpis || {
    traffic: 0,
    newsletterSignups: 0,
    leads: 0,
    contentThroughput: 0
  };
  const ideaEngine = dashboardData?.ideaEngine || {
    newIdeas: 0,
    postsForApproval: 0,
    scheduled: 0
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
            Dashboard
          </h1>
          <Button asChild>
            <Link to="/admin/ideas">
              Manage Ideas
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Website Traffic
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-vapor-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.traffic || 0}</div>
              <p className="text-xs text-gray-600">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Newsletter Signups
              </CardTitle>
              <Users className="h-4 w-4 text-smoky-lavender" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.newsletterSignups || 0}</div>
              <p className="text-xs text-gray-600">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                New Leads
              </CardTitle>
              <FileText className="h-4 w-4 text-launch-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.leads || 0}</div>
              <p className="text-xs text-gray-600">
                +3 this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900">
                Content Throughput
              </CardTitle>
              <Zap className="h-4 w-4 text-vapor-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{kpis.contentThroughput || 0}</div>
              <p className="text-xs text-gray-600">
                pieces this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Idea Engine Workflow */}
        <Card className="bg-rocket-gray/10 border-rocket-gray/20">
          <CardHeader>
            <CardTitle className="text-gray-900 font-['Architects_Daughter']">
              Idea Engine Workflow
            </CardTitle>
            <CardDescription className="text-gray-600">
              Track your content pipeline from ideas to published posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4">
              <Link 
                to="/admin/ideas?status=new" 
                className="flex-1 p-4 bg-vapor-purple/10 border border-vapor-purple/20 rounded-lg hover:bg-vapor-purple/20 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {ideaEngine.newIdeas || 0}
                  </div>
                  <div className="text-sm text-gray-900">New Ideas</div>
                </div>
              </Link>

              <div className="text-rocket-gray">→</div>

              <Link 
                to="/admin/ideas?tab=drafts&status=draft" 
                className="flex-1 p-4 bg-launch-orange/10 border border-launch-orange/20 rounded-lg hover:bg-launch-orange/20 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {ideaEngine.postsForApproval || 0}
                  </div>
                  <div className="text-sm text-gray-900">Posts for Approval</div>
                </div>
              </Link>

              <div className="text-rocket-gray">→</div>

              <Link 
                to="/admin/ideas?tab=drafts&status=scheduled" 
                className="flex-1 p-4 bg-smoky-lavender/10 border border-smoky-lavender/20 rounded-lg hover:bg-smoky-lavender/20 transition-colors"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {ideaEngine.scheduled || 0}
                  </div>
                  <div className="text-sm text-gray-900">Scheduled</div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Content Management</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your website content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/content">Manage Content</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Contact Leads</CardTitle>
              <CardDescription className="text-gray-600">
                Review new contact submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/contacts">View Leads</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-gray-900">Settings</CardTitle>
              <CardDescription className="text-gray-600">
                Configure system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/settings">Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
