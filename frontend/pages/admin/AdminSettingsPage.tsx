import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
          Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">API Keys</CardTitle>
              <CardDescription className="text-gray-600">
                Manage OpenAI, email, and other service keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">User Management</CardTitle>
              <CardDescription className="text-gray-600">
                Manage admin users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">Coming soon...</p>
            </CardContent>
          </Card>




        </div>
      </div>
    </AdminLayout>
  );
}
