import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
          Content Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Pricing Items</CardTitle>
              <CardDescription className="text-gray-600">
                Manage pricing packages and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Portfolio Projects</CardTitle>
              <CardDescription className="text-gray-600">
                Add and edit portfolio items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Blog Posts</CardTitle>
              <CardDescription className="text-gray-600">
                Create and manage blog content
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
