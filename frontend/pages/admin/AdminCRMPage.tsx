import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Mail, Phone, Building2, Tag, Calendar, Edit, Trash2, Eye, MessageSquare, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { useBackend } from '../../hooks/useBackend';

export default function AdminCRMPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contexts
  const { data: contextsData } = useQuery({
    queryKey: ['crm-contexts'],
    queryFn: () => backend.crm.listContexts(),
  });

  // Fetch contacts
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['crm-contacts', selectedContext, selectedStatus, searchTerm],
    queryFn: () => backend.crm.listContacts({
      contextId: selectedContext !== 'all' ? parseInt(selectedContext) : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
      search: searchTerm || undefined,
    }),
  });

  const getContextColor = (contextName?: string) => {
    const context = contextsData?.contexts.find(c => c.name === contextName);
    return context?.color || '#6B7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      case 'prospect': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'active': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
            CRM
          </h1>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 w-4 h-4" />
            New Contact
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{contactsData?.total || 0}</p>
                </div>
                <User className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contactsData?.contacts.filter(c => c.status === 'customer').length || 0}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prospects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contactsData?.contacts.filter(c => c.status === 'prospect').length || 0}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Contexts</p>
                  <p className="text-2xl font-bold text-gray-900">{contextsData?.contexts.length || 0}</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-gray-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedContext} onValueChange={setSelectedContext}>
                <SelectTrigger>
                  <SelectValue placeholder="All Contexts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contexts</SelectItem>
                  {contextsData?.contexts.map((context) => (
                    <SelectItem key={context.id} value={context.id.toString()}>
                      {context.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Contacts</CardTitle>
            <CardDescription className="text-gray-600">
              Manage all your personal and professional contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contactsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : contactsData?.contacts.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No contacts found</p>
                <p className="text-sm text-gray-500 mt-1">Create your first contact to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contactsData?.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-lg">
                            {contact.firstName[0]}{contact.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </h3>
                            <Badge className={getStatusColor(contact.status)} variant="outline">
                              {contact.status}
                            </Badge>
                            {contact.contextName && (
                              <Badge 
                                variant="outline"
                                style={{ 
                                  borderColor: getContextColor(contact.contextName),
                                  color: getContextColor(contact.contextName)
                                }}
                              >
                                {contact.contextName}
                              </Badge>
                            )}
                          </div>
                          {contact.title && contact.companyName && (
                            <p className="text-sm text-gray-600 mb-2">
                              {contact.title} at {contact.companyName}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {contact.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="w-4 h-4" />
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center space-x-1">
                                <Phone className="w-4 h-4" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}