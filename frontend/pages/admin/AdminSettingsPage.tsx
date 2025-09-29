import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-cloud-white font-['Architects_Daughter']">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">API Keys</CardTitle>
              <CardDescription className="text-rocket-gray">
                Manage OpenAI, email, and other service keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">User Management</CardTitle>
              <CardDescription className="text-rocket-gray">
                Manage admin users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">Style Guides</CardTitle>
              <CardDescription className="text-rocket-gray">
                Configure platform-specific writing styles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">Feed Sources</CardTitle>
              <CardDescription className="text-rocket-gray">
                Manage RSS feeds and content sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
