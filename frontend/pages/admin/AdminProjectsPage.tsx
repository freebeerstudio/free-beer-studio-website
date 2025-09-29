import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star, Folder, ExternalLink, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
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

interface Project {
  id: number;
  title: string;
  description: string | null;
  coverImageUrl: string | null;
  gallery: string[];
  externalUrl: string | null;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectFormData {
  title: string;
  description: string;
  coverImageUrl: string;
  gallery: string[];
  externalUrl: string;
  isFeatured: boolean;
  sortOrder: number;
}

export default function AdminProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => backend.admin.listProjects(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; description?: string; coverImageUrl?: string; gallery?: string[]; externalUrl?: string; isFeatured?: boolean; sortOrder?: number; }) => backend.admin.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; title?: string; description?: string; coverImageUrl?: string; gallery?: string[]; externalUrl?: string; isFeatured?: boolean; sortOrder?: number; }) => backend.admin.updateProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setEditingProject(null);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.admin.deleteProject({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      setDeletingProject(null);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    },
  });

  const handleCreate = (data: ProjectFormData) => {
    const payload = {
      ...data,
      description: data.description || undefined,
      coverImageUrl: data.coverImageUrl || undefined,
      gallery: data.gallery.filter(url => url.trim() !== ''),
      externalUrl: data.externalUrl || undefined,
    };
    createMutation.mutate(payload);
  };

  const handleUpdate = (data: ProjectFormData) => {
    if (editingProject) {
      const payload = {
        id: editingProject.id,
        ...data,
        description: data.description || undefined,
        coverImageUrl: data.coverImageUrl || undefined,
        gallery: data.gallery.filter(url => url.trim() !== ''),
        externalUrl: data.externalUrl || undefined,
      };
      updateMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (deletingProject) {
      deleteMutation.mutate(deletingProject.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
            <p className="text-muted-foreground">
              Manage portfolio projects displayed on the public portfolio page
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to your portfolio collection.
                </DialogDescription>
              </DialogHeader>
              <ProjectForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardHeader className="h-32 bg-muted/50"></CardHeader>
                <CardContent className="h-16 bg-muted/30"></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.projects.map((project) => (
              <Card key={project.id} className="relative overflow-hidden">
                {project.isFeatured && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-orange-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                  {project.coverImageUrl ? (
                    <img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Image className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {project.externalUrl && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">
                    {project.title}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Folder className="w-4 h-4" />
                        <span>{project.gallery.length} images</span>
                      </div>
                      <div>Order: {project.sortOrder}</div>
                    </div>

                    {project.externalUrl && (
                      <div className="text-sm">
                        <span className="font-medium">URL: </span>
                        <a 
                          href={project.externalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all"
                        >
                          {project.externalUrl.length > 30 
                            ? project.externalUrl.substring(0, 30) + '...' 
                            : project.externalUrl}
                        </a>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProject(project)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingProject(project)}
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

        {projectsData?.projects.length === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Folder className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first portfolio project.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Make changes to the project details.
              </DialogDescription>
            </DialogHeader>
            {editingProject && (
              <ProjectForm
                initialData={editingProject}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingProject} onOpenChange={(open) => !open && setDeletingProject(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone.
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

// Project Form Component
function ProjectForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: Project; 
  onSubmit: (data: ProjectFormData) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    gallery: initialData?.gallery || [''],
    externalUrl: initialData?.externalUrl || '',
    isFeatured: initialData?.isFeatured || false,
    sortOrder: initialData?.sortOrder || 0,
  });

  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.map((url, i) => i === index ? value : url)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <label className="text-sm font-medium">Sort Order</label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image URL</label>
        <input
          type="url"
          value={formData.coverImageUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">External URL</label>
        <input
          type="url"
          value={formData.externalUrl}
          onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
          placeholder="https://..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Gallery Images</label>
          <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
            <Plus className="w-4 h-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-2">
          {formData.gallery.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="url"
                value={url}
                onChange={(e) => updateGalleryImage(index, e.target.value)}
                placeholder="Enter image URL"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              {formData.gallery.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Settings</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
            className="h-4 w-4"
          />
          <span className="text-sm">Mark as featured project</span>
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