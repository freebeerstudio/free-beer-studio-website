import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from '@/components/ui/file-upload';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminLayout from '../../components/layout/AdminLayout';
import backend from '~backend/client';

interface PricingItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  features: string[];
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PricingFormData {
  title: string;
  description: string;
  imageUrl: string;
  price: number | null;
  features: string[];
  isFeatured: boolean;
  sortOrder: number;
}

export default function AdminPricingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<PricingItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['admin-pricing'],
    queryFn: () => backend.admin.listPricingItems(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description: string; imageUrl: string; price?: number; features: string[]; isFeatured: boolean; sortOrder: number; }) => backend.admin.createPricingItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Pricing item created successfully',
      });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create pricing item',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; title?: string; description?: string; imageUrl?: string; price?: number; features?: string[]; isFeatured?: boolean; sortOrder?: number; }) => backend.admin.updatePricingItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      setEditingItem(null);
      toast({
        title: 'Success',
        description: 'Pricing item updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pricing item',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.admin.deletePricingItem({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pricing'] });
      setDeletingItem(null);
      toast({
        title: 'Success',
        description: 'Pricing item deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete pricing item',
        variant: 'destructive',
      });
    },
  });

  const handleCreate = (data: PricingFormData) => {
    const payload = {
      ...data,
      price: data.price === null ? undefined : data.price,
    };
    createMutation.mutate(payload);
  };

  const handleUpdate = (data: PricingFormData) => {
    if (editingItem) {
      const payload = {
        id: editingItem.id,
        ...data,
        price: data.price === null ? undefined : data.price,
      };
      updateMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate(deletingItem.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pricing Management</h1>
            <p className="text-muted-foreground">
              Manage pricing plans displayed on the public pricing page
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Pricing Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Pricing Plan</DialogTitle>
                <DialogDescription>
                  Add a new pricing plan to display on the public pricing page.
                </DialogDescription>
              </DialogHeader>
              <PricingForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted"></CardHeader>
                <CardContent className="h-48 bg-muted/50"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingData?.items.map((item) => (
              <Card key={item.id} className="relative">
                {item.isFeatured && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      {item.description && (
                        <CardDescription className="mt-2 line-clamp-2">
                          {item.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    {item.price ? (
                      <div className="flex items-center text-2xl font-bold text-primary">
                        <DollarSign className="w-5 h-5" />
                        {item.price.toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">Custom</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Features ({item.features.length})</p>
                      <div className="space-y-1">
                        {item.features.slice(0, 3).map((feature, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            • {feature}
                          </p>
                        ))}
                        {item.features.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            + {item.features.length - 3} more...
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Order: {item.sortOrder}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pricingData?.items.length === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No pricing plans</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first pricing plan.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Pricing Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pricing Plan</DialogTitle>
              <DialogDescription>
                Make changes to the pricing plan details.
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <PricingForm
                initialData={editingItem}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Pricing Plan</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingItem?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

// Pricing Form Component
function PricingForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: PricingItem; 
  onSubmit: (data: PricingFormData) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<PricingFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    price: initialData?.price || null,
    features: initialData?.features || [''],
    isFeatured: initialData?.isFeatured || false,
    sortOrder: initialData?.sortOrder || 0,
  });

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFeatures = formData.features.filter(f => f.trim() !== '');
    onSubmit({
      ...formData,
      features: cleanFeatures,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value ? parseFloat(e.target.value) : null }))}
            placeholder="Leave empty for 'Custom'"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <FileUpload
          category="pricing"
          currentUrl={formData.imageUrl}
          onFileUploaded={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
          onFileRemoved={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
          accept="image/*"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Features</label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Enter feature description"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort Order</label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Featured</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="h-4 w-4"
            />
            <span className="text-sm">Mark as featured plan</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
}