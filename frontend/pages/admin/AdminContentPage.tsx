import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, Folder, PenTool, ArrowRight, Plus, BarChart3 } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';

export default function AdminContentPage() {
  // Fetch summary data for each content type
  const { data: pricingData } = useQuery({
    queryKey: ['admin-pricing-summary'],
    queryFn: () => backend.admin.listPricingItems(),
  });

  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects-summary'], 
    queryFn: () => backend.admin.listProjects(),
  });

  const { data: blogData } = useQuery({
    queryKey: ['admin-blog-summary'],
    queryFn: () => backend.admin.listBlogPosts({}),
  });

  const pricingStats = {
    total: pricingData?.items.length || 0,
    featured: pricingData?.items.filter(item => item.isFeatured).length || 0,
  };

  const projectStats = {
    total: projectsData?.projects.length || 0,
    featured: projectsData?.projects.filter(project => project.isFeatured).length || 0,
  };

  const blogStats = {
    total: blogData?.posts.length || 0,
    published: blogData?.posts.filter(post => post.status === 'published').length || 0,
    drafts: blogData?.posts.filter(post => post.status === 'draft').length || 0,
    aiGenerated: blogData?.posts.filter(post => post.source !== 'manual').length || 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Content Management</h1>
          <p className="text-black">
            Manage all your website content including pricing, portfolio projects, and blog posts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pricing Management Widget */}
          <Card className="relative overflow-hidden bg-white border-2 border-gray-400 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-black">Pricing Plans</CardTitle>
              </div>
              <CardDescription className="text-black">
                Manage pricing packages and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-black" />
                    <span className="text-2xl font-bold text-black">{pricingStats.total}</span>
                    <span className="text-sm text-black">total plans</span>
                  </div>
                  {pricingStats.featured > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {pricingStats.featured} featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button asChild className="flex-1 bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/pricing">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Manage Plans
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/pricing">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects Management Widget */}
          <Card className="relative overflow-hidden bg-white border-2 border-gray-400 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-black">Portfolio Projects</CardTitle>
              </div>
              <CardDescription className="text-black">
                Add and edit portfolio items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-black" />
                    <span className="text-2xl font-bold text-black">{projectStats.total}</span>
                    <span className="text-sm text-black">projects</span>
                  </div>
                  {projectStats.featured > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {projectStats.featured} featured
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button asChild className="flex-1 bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/projects">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Manage Projects
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/projects">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blog Management Widget */}
          <Card className="relative overflow-hidden bg-white border-2 border-gray-400 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <PenTool className="w-5 h-5 text-green-500" />
                <CardTitle className="text-black">Blog Posts</CardTitle>
              </div>
              <CardDescription className="text-black">
                Create and manage blog content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-black" />
                  <span className="text-2xl font-bold text-black">{blogStats.total}</span>
                  <span className="text-sm text-black">total posts</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {blogStats.published > 0 && (
                    <Badge variant="default" className="text-xs bg-green-500">
                      {blogStats.published} published
                    </Badge>
                  )}
                  {blogStats.drafts > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {blogStats.drafts} drafts
                    </Badge>
                  )}
                  {blogStats.aiGenerated > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {blogStats.aiGenerated} AI-generated
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button asChild className="flex-1 bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/blog">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Manage Posts
                  </Link>
                </Button>
                <Button asChild variant="outline" className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]">
                  <Link to="/admin/blog">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-2 border-gray-400 shadow-lg">
          <CardHeader>
            <CardTitle className="text-black">Quick Actions</CardTitle>
            <CardDescription className="text-black">
              Common content management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-white border-2 border-black shadow-[0_4px_14px_rgb(0,0,0,0.25)] hover:bg-black/10">
                <Link to="/admin/pricing">
                  <DollarSign className="w-8 h-8 text-orange-500" />
                  <div className="text-center">
                    <div className="font-medium text-black">Create Pricing Plan</div>
                    <div className="text-xs text-black">Add a new pricing tier</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-white border-2 border-black shadow-[0_4px_14px_rgb(0,0,0,0.25)] hover:bg-black/10">
                <Link to="/admin/projects">
                  <Folder className="w-8 h-8 text-blue-500" />
                  <div className="text-center">
                    <div className="font-medium text-black">Add Portfolio Project</div>
                    <div className="text-xs text-black">Showcase your work</div>
                  </div>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 bg-white border-2 border-black shadow-[0_4px_14px_rgb(0,0,0,0.25)] hover:bg-black/10">
                <Link to="/admin/blog">
                  <PenTool className="w-8 h-8 text-green-500" />
                  <div className="text-center">
                    <div className="font-medium text-black">Write Blog Post</div>
                    <div className="text-xs text-black">Create new content</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
