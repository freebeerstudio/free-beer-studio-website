import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminContactsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-cloud-white font-['Architects_Daughter']">
          Contact Submissions
        </h1>

        <Card className="bg-rocket-gray/10 border-rocket-gray/20">
          <CardHeader>
            <CardTitle className="text-cloud-white">Recent Submissions</CardTitle>
            <CardDescription className="text-rocket-gray">
              Manage contact form submissions and leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-rocket-gray text-sm">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
