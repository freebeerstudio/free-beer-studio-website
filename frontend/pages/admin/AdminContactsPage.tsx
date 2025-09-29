import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContactsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
          Contact Submissions
        </h1>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Submissions</CardTitle>
            <CardDescription className="text-gray-600">
              Manage contact form submissions and leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
