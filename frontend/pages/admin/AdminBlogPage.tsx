import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, Calendar, User, FileText, Bot, Brain, Filter } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '../../components/layout/AdminLayout';
import backend from '~backend/client';

interface BlogPost {
  id: number;
  title: string;
  subtitle: string | null;
  slug: string;
  coverImageUrl: string | null;
  gallery: string[];
  body: string | null;
  excerpt: string | null;
  status: "draft" | "scheduled" | "published";
  scheduledAt: Date | null;
  publishedAt: Date | null;
  source: "manual" | "ai" | "idea_engine";
  ideaId: number | null;
  author: {
    id: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BlogPostFormData {
  title: string;
  subtitle: string;
  slug: string;
  coverImageUrl: string;
  gallery: string[];
  body: string;
  excerpt: string;
  status: "draft" | "scheduled" | "published";
  scheduledAt: Date | null;
}

export default function AdminBlogPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['admin-blog', sourceFilter],
    queryFn: () => backend.admin.listBlogPosts(sourceFilter === 'all' ? {} : { source: sourceFilter }),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; subtitle?: string; slug: string; coverImageUrl?: string; gallery?: string[]; body?: string; excerpt?: string; status?: "draft" | "scheduled" | "published"; scheduledAt?: Date; }) => backend.admin.createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; title?: string; subtitle?: string; slug?: string; coverImageUrl?: string; gallery?: string[]; body?: string; excerpt?: string; status?: "draft" | "scheduled" | "published"; scheduledAt?: Date; }) => backend.admin.updateBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setEditingPost(null);
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => backend.admin.deleteBlogPost({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      setDeletingPost(null);
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    },
  });

  const handleCreate = (data: BlogPostFormData) => {
    const payload = {
      ...data,
      subtitle: data.subtitle || undefined,
      coverImageUrl: data.coverImageUrl || undefined,
      gallery: data.gallery.filter(url => url.trim() !== ''),
      body: data.body || undefined,
      excerpt: data.excerpt || undefined,
      scheduledAt: data.scheduledAt || undefined,
    };
    createMutation.mutate(payload);
  };

  const handleUpdate = (data: BlogPostFormData) => {
    if (editingPost) {
      const payload = {
        id: editingPost.id,
        ...data,
        subtitle: data.subtitle || undefined,
        coverImageUrl: data.coverImageUrl || undefined,
        gallery: data.gallery.filter(url => url.trim() !== ''),
        body: data.body || undefined,
        excerpt: data.excerpt || undefined,
        scheduledAt: data.scheduledAt || undefined,
      };
      updateMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (deletingPost) {
      deleteMutation.mutate(deletingPost.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ai': return <Bot className="w-4 h-4" />;
      case 'idea_engine': return <Brain className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const filteredPosts = blogData?.posts.filter(post => {
    if (statusFilter === 'all') return true;
    return post.status === statusFilter;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
            <p className="text-muted-foreground">
              Manage blog posts including AI-generated content from the idea engine
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post manually.
                </DialogDescription>
              </DialogHeader>
              <BlogPostForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
              <SelectItem value="idea_engine">Idea Engine</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
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
            {filteredPosts.map((post) => (
              <Card key={post.id} className="relative overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <Badge className={`${getStatusColor(post.status)} text-white`}>
                    {post.status}
                  </Badge>
                </div>
                
                {/* Cover Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {post.coverImageUrl ? (
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl line-clamp-2 flex-1">
                      {post.title}
                    </CardTitle>
                    <div className="ml-2 flex items-center space-x-1 text-muted-foreground">
                      {getSourceIcon(post.source)}
                    </div>
                  </div>
                  {post.subtitle && (
                    <CardDescription className="line-clamp-2">
                      {post.subtitle}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        {post.author && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author.email.split('@')[0]}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {post.source === 'idea_engine' && post.ideaId && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        Generated from Idea #{post.ideaId}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-xs text-muted-foreground">
                        Slug: /{post.slug}
                      </div>
                      <div className="flex items-center space-x-2">
                        {post.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingPost(post)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingPost(post)}
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

        {filteredPosts.length === 0 && !isLoading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {sourceFilter === 'all' ? 'No blog posts yet' : `No ${sourceFilter} posts found`}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {sourceFilter === 'manual' 
                  ? 'Create your first blog post manually or check the Idea Engine for AI-generated content.'
                  : 'Create blog posts manually or let the AI Idea Engine generate content for you.'
                }
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
              <DialogDescription>
                Make changes to the blog post details.
              </DialogDescription>
            </DialogHeader>
            {editingPost && (
              <BlogPostForm
                initialData={editingPost}
                onSubmit={handleUpdate}
                isLoading={updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingPost} onOpenChange={(open) => !open && setDeletingPost(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingPost?.title}"? This action cannot be undone.
                {deletingPost?.status === 'published' && (
                  <span className="block mt-2 text-red-600 font-medium">
                    Warning: This post is currently published and visible to users.
                  </span>
                )}
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

// Blog Post Form Component
function BlogPostForm({ 
  initialData, 
  onSubmit, 
  isLoading 
}: { 
  initialData?: BlogPost; 
  onSubmit: (data: BlogPostFormData) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    slug: initialData?.slug || '',
    coverImageUrl: initialData?.coverImageUrl || '',
    gallery: initialData?.gallery || [''],
    body: initialData?.body || '',
    excerpt: initialData?.excerpt || '',
    status: initialData?.status || 'draft',
    scheduledAt: initialData?.scheduledAt || null,
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGallery = formData.gallery.filter(url => url.trim() !== '');
    onSubmit({
      ...formData,
      gallery: cleanGallery,
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
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slug *</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">URL: /blog/{formData.slug}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Cover Image</label>
        <FileUpload
          category="blog"
          currentUrl={formData.coverImageUrl}
          onFileUploaded={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url }))}
          onFileRemoved={() => setFormData(prev => ({ ...prev, coverImageUrl: '' }))}
          accept="image/*"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={3}
          placeholder="A brief summary of the post..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <textarea
          value={formData.body}
          onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
          className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={10}
          placeholder="Write your blog post content here..."
        />
        <p className="text-xs text-muted-foreground">Supports Markdown formatting</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Gallery Images</label>
          <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
            <Plus className="w-4 h-4 mr-1" />
            Add Image
          </Button>
        </div>
        <div className="space-y-4">
          {formData.gallery.map((url, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1">
                <FileUpload
                  category="blog"
                  currentUrl={url}
                  onFileUploaded={(uploadedUrl) => updateGalleryImage(index, uploadedUrl)}
                  onFileRemoved={() => updateGalleryImage(index, '')}
                  accept="image/*"
                />
              </div>
              {formData.gallery.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeGalleryImage(index)}
                  className="mt-2"
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
          <label className="text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as "draft" | "scheduled" | "published" }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        {formData.status === 'scheduled' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduled Date</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt ? new Date(formData.scheduledAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                scheduledAt: e.target.value ? new Date(e.target.value) : null 
              }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : (initialData ? 'Update Post' : 'Create Post')}
        </Button>
      </div>
    </form>
  );
}