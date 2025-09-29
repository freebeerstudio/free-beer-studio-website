import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-cloud-white font-['Architects_Daughter']">
          Content Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">Pricing Items</CardTitle>
              <CardDescription className="text-rocket-gray">
                Manage pricing packages and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">Portfolio Projects</CardTitle>
              <CardDescription className="text-rocket-gray">
                Add and edit portfolio items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-rocket-gray text-sm">Coming soon...</p>
            </CardContent>
          </Card>

          <Card className="bg-rocket-gray/10 border-rocket-gray/20">
            <CardHeader>
              <CardTitle className="text-cloud-white">Blog Posts</CardTitle>
              <CardDescription className="text-rocket-gray">
                Create and manage blog content
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
