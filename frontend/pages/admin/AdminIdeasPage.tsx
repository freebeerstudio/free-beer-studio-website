import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Send, Check, X, ExternalLink, ChevronDown, ChevronUp, Rss, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import { useBackend } from '../../hooks/useBackend';

export default function AdminIdeasPage() {
  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [feedSourcesExpanded, setFeedSourcesExpanded] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch ideas
  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: ['admin-ideas'],
    queryFn: () => backend.ideas.listIdeas({}),
  });

  // Fetch feed sources
  const { data: feedSourcesData, isLoading: feedSourcesLoading } = useQuery({
    queryKey: ['admin-feed-sources'],
    queryFn: () => backend.ideas.listFeedSources({}),
  });

  // Fetch drafts
  const { data: draftsData, isLoading: draftsLoading } = useQuery({
    queryKey: ['admin-drafts'],
    queryFn: () => backend.ideas.listDrafts({}),
  });

  // Create feed source mutation
  const createFeedMutation = useMutation({
    mutationFn: (data: { name: string; url: string }) =>
      backend.ideas.createFeedSource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feed-sources'] });
      setNewFeedName('');
      setNewFeedUrl('');
      toast({
        title: 'Success',
        description: 'Feed source created successfully',
      });
    },
    onError: (error) => {
      console.error('Create feed error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feed source',
        variant: 'destructive',
      });
    },
  });

  // Delete feed source mutation
  const deleteFeedMutation = useMutation({
    mutationFn: (id: number) => backend.ideas.deleteFeedSource({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feed-sources'] });
      toast({
        title: 'Success',
        description: 'Feed source deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete feed error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feed source',
        variant: 'destructive',
      });
    },
  });

  // Scrape feed source mutation
  const scrapeFeedMutation = useMutation({
    mutationFn: (id: number) => backend.ideas.scrapeFeedSource({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['admin-feed-sources'] });
      toast({
        title: 'Success',
        description: 'Feed scraped and ideas created successfully',
      });
    },
    onError: (error) => {
      console.error('Scrape feed error:', error);
      toast({
        title: 'Error',
        description: 'Failed to scrape feed source',
        variant: 'destructive',
      });
    },
  });

  // Ingest idea mutation
  const ingestMutation = useMutation({
    mutationFn: (data: { input: string; inputType: 'url' | 'text' }) =>
      backend.ideas.ingestIdea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ideas'] });
      setNewIdeaInput('');
      toast({
        title: 'Success',
        description: 'Idea ingested successfully',
      });
    },
    onError: (error) => {
      console.error('Ingest error:', error);
      toast({
        title: 'Error',
        description: 'Failed to ingest idea',
        variant: 'destructive',
      });
    },
  });

  // Approve idea mutation
  const approveMutation = useMutation({
    mutationFn: (data: { id: number; platforms: string[] }) =>
      backend.ideas.approveIdea(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ideas'] });
      queryClient.invalidateQueries({ queryKey: ['admin-drafts'] });
      toast({
        title: 'Success',
        description: 'Idea approved and drafts created',
      });
    },
    onError: (error) => {
      console.error('Approve error:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve idea',
        variant: 'destructive',
      });
    },
  });

  const handleIngestIdea = () => {
    if (!newIdeaInput.trim()) return;
    
    ingestMutation.mutate({
      input: newIdeaInput,
      inputType,
    });
  };

  const handleApproveIdea = (ideaId: number, platforms: string[]) => {
    approveMutation.mutate({
      id: ideaId,
      platforms,
    });
  };

  const handleAddFeedSource = () => {
    if (!newFeedName.trim() || !newFeedUrl.trim()) return;
    
    createFeedMutation.mutate({
      name: newFeedName,
      url: newFeedUrl,
    });
  };

  const handleDeleteFeedSource = (id: number) => {
    deleteFeedMutation.mutate(id);
  };

  const handleScrapeFeed = (id: number) => {
    scrapeFeedMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 font-['Architects_Daughter']">
            Idea Engine
          </h1>
        </div>

        <Tabs defaultValue="ingest" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-rocket-gray/10">
            <TabsTrigger value="ingest" className="data-[state=active]:bg-vapor-purple/20">
              Ingest Ideas
            </TabsTrigger>
            <TabsTrigger value="ideas" className="data-[state=active]:bg-vapor-purple/20">
              Manage Ideas
            </TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-vapor-purple/20">
              Review Drafts
            </TabsTrigger>
          </TabsList>

          {/* Ingest Tab */}
          <TabsContent value="ingest" className="space-y-6">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Add New Idea</CardTitle>
                <CardDescription className="text-gray-600">
                  Submit a URL or text to generate content ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={inputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInputType('url')}
                    size="sm"
                  >
                    URL
                  </Button>
                  <Button
                    variant={inputType === 'text' ? 'default' : 'outline'}
                    onClick={() => setInputType('text')}
                    size="sm"
                  >
                    Text
                  </Button>
                </div>

                {inputType === 'url' ? (
                  <Input
                    placeholder="https://example.com/article"
                    value={newIdeaInput}
                    onChange={(e) => setNewIdeaInput(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  />
                ) : (
                  <Textarea
                    placeholder="Enter your idea or paste text content..."
                    value={newIdeaInput}
                    onChange={(e) => setNewIdeaInput(e.target.value)}
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[100px]"
                  />
                )}

                <Button
                  onClick={handleIngestIdea}
                  disabled={!newIdeaInput.trim() || ingestMutation.isPending}
                  className="bg-launch-orange hover:bg-launch-orange/80"
                >
                  <Send className="mr-2 w-4 h-4" />
                  {ingestMutation.isPending ? 'Processing...' : 'Ingest Idea'}
                </Button>
              </CardContent>
            </Card>

            {/* Feed Sources Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader className="cursor-pointer" onClick={() => setFeedSourcesExpanded(!feedSourcesExpanded)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center">
                      <Rss className="mr-2 w-5 h-5" />
                      Feed Sources
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Manage RSS feeds and external blog URLs for content scraping
                    </CardDescription>
                  </div>
                  {feedSourcesExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              
              {feedSourcesExpanded && (
                <CardContent className="space-y-4">
                  {/* Add New Feed Form */}
                  <div className="space-y-3 p-4 bg-rocket-gray/5 rounded-lg border border-rocket-gray/20">
                    <h4 className="text-gray-900 font-medium">Add New Feed Source</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Feed name (e.g., TechCrunch)"
                        value={newFeedName}
                        onChange={(e) => setNewFeedName(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      />
                      <Input
                        placeholder="RSS/Blog URL"
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      onClick={handleAddFeedSource}
                      disabled={!newFeedName.trim() || !newFeedUrl.trim() || createFeedMutation.isPending}
                      className="bg-vapor-purple hover:bg-vapor-purple/80"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      {createFeedMutation.isPending ? 'Adding...' : 'Add Feed Source'}
                    </Button>
                  </div>

                  {/* Existing Feed Sources */}
                  <div className="space-y-3">
                    <h4 className="text-gray-900 font-medium">Current Feed Sources</h4>
                    {feedSourcesLoading ? (
                      <div className="space-y-2">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="p-3 border border-gray-200 rounded-lg bg-white animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {feedSourcesData?.feedSources.map((feedSource) => (
                          <div key={feedSource.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                            <div className="flex items-center space-x-3">
                              <Rss className="w-4 h-4 text-vapor-purple" />
                              <div>
                                <p className="text-gray-900 font-medium">{feedSource.name}</p>
                                <p className="text-gray-600 text-sm">{feedSource.url}</p>
                                {feedSource.lastChecked && (
                                  <p className="text-gray-500 text-xs">
                                    Last checked: {new Date(feedSource.lastChecked).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="outline" 
                                className={feedSource.isActive 
                                  ? "text-green-600 border-green-600" 
                                  : "text-gray-600 border-gray-600"
                                }
                              >
                                {feedSource.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleScrapeFeed(feedSource.id)}
                                disabled={scrapeFeedMutation.isPending}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                title="Scrape this feed for new content"
                              >
                                <Rss className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteFeedSource(feedSource.id)}
                                disabled={deleteFeedMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        
                        {feedSourcesData?.feedSources.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Rss className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No feed sources configured yet.</p>
                            <p className="text-sm">Add RSS feeds or blog URLs above to start collecting content ideas.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-4">
            {ideasLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-24 h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {ideasData?.ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onApprove={handleApproveIdea}
                    isApproving={approveMutation.isPending}
                  />
                ))}
                {ideasData?.ideas.length === 0 && (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No ideas found. Start by ingesting some content!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-6">
            {draftsLoading ? (
              <div className="grid gap-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="bg-white border-gray-200 animate-pulse">
                    <CardHeader className="h-24"></CardHeader>
                    <CardContent className="h-32"></CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {draftsData?.drafts.map((draft) => (
                  <DraftCard key={draft.id} draft={draft} />
                ))}
                {draftsData?.drafts.length === 0 && (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No drafts found. Approve some ideas to create drafts!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

interface IdeaCardProps {
  idea: any;
  onApprove: (ideaId: number, platforms: string[]) => void;
  isApproving: boolean;
}

function IdeaCard({ idea, onApprove, isApproving }: IdeaCardProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  
  const platforms = [
    { id: 'blog', label: 'Blog' },
    { id: 'substack', label: 'Substack' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'shorts', label: 'Shorts' },
  ];

  const handlePlatformChange = (value: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(value)) {
        return prev.filter(p => p !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleApprove = () => {
    if (selectedPlatforms.length > 0) {
      onApprove(idea.id, selectedPlatforms);
      setIsApproved(true);
    }
  };

  const getStatusIcon = () => {
    if (idea.status === 'approved' || isApproved) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (idea.status === 'rejected') {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
      {/* Left side - Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate mb-1">
          {idea.title || 'Untitled Idea'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {idea.summary}
        </p>
        
        {idea.canonicalUrl && (
          <div className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <a 
              href={idea.canonicalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline truncate"
            >
              {idea.canonicalUrl}
            </a>
          </div>
        )}
      </div>

      {/* Center - Status and Channel Tags */}
      <div className="flex flex-col items-center gap-2 px-4">
        {getStatusIcon()}
        
        {(idea.status === 'approved' || isApproved) && selectedPlatforms.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {selectedPlatforms.map(platform => (
              <Badge 
                key={platform} 
                variant="secondary"
                className="text-xs bg-smoky-lavender/20 text-smoky-lavender border-smoky-lavender"
              >
                {platforms.find(p => p.id === platform)?.label}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              idea.status === 'new' ? 'bg-vapor-purple/20 text-vapor-purple border-vapor-purple' :
              idea.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' :
              'bg-red-100 text-red-700 border-red-300'
            }`}
          >
            {idea.status}
          </Badge>
        </div>
      </div>

      {/* Right side - Controls */}
      {idea.status === 'new' && !isApproved && (
        <div className="flex flex-col gap-2 min-w-[200px]">
          {/* Platform Multi-select */}
          <Select onValueChange={handlePlatformChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select platforms..." />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem 
                  key={platform.id} 
                  value={platform.id}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border rounded ${
                      selectedPlatforms.includes(platform.id) 
                        ? 'bg-smoky-lavender border-smoky-lavender' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPlatforms.includes(platform.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    {platform.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected platforms display */}
          {selectedPlatforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedPlatforms.map(platform => (
                <Badge 
                  key={platform} 
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-red-50 border-gray-300"
                  onClick={() => setSelectedPlatforms(prev => prev.filter(p => p !== platform))}
                >
                  {platforms.find(p => p.id === platform)?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              disabled={selectedPlatforms.length === 0 || isApproving}
              size="sm"
              className="flex-1 bg-smoky-lavender hover:bg-smoky-lavender/80 h-8"
            >
              <Check className="w-3 h-3 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 h-8"
              onClick={() => {
                // TODO: Implement reject functionality
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Show metadata for approved/rejected items */}
      {(idea.status !== 'new' || isApproved) && (
        <div className="text-xs text-gray-500 min-w-[120px] text-right">
          <div>Added: {new Date(idea.createdAt).toLocaleDateString()}</div>
          <div className="capitalize">{idea.inputType} source</div>
        </div>
      )}
    </div>
  );
}

interface DraftCardProps {
  draft: any;
}

function DraftCard({ draft }: DraftCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-launch-orange/20 text-launch-orange';
      case 'approved': return 'bg-smoky-lavender/20 text-smoky-lavender';
      case 'scheduled': return 'bg-vapor-purple/20 text-vapor-purple';
      case 'published': return 'bg-smoky-lavender/20 text-smoky-lavender';
      case 'rejected': return 'bg-rocket-gray/20 text-gray-600';
      default: return 'bg-rocket-gray/20 text-gray-600';
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-gray-900 text-lg">
              {draft.idea.title || 'Untitled Draft'}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(draft.status)}>{draft.status}</Badge>
              <Badge variant="outline" className="text-gray-600 border-rocket-gray">
                {draft.platform}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {draft.idea.summary && (
          <p className="text-gray-600 text-sm">{draft.idea.summary}</p>
        )}
        
        {draft.status === 'draft' && (
          <div className="flex space-x-2">
            <Button className="bg-smoky-lavender hover:bg-smoky-lavender/80">
              <Check className="mr-2 w-4 h-4" />
              Approve
            </Button>
            <Button variant="outline" className="border-rocket-gray text-gray-600">
              Edit
            </Button>
            <Button variant="outline" className="border-rocket-gray text-gray-600">
              <X className="mr-2 w-4 h-4" />
              Reject
            </Button>
          </div>
        )}

        {draft.scheduledAt && (
          <p className="text-sm text-gray-600">
            Scheduled for: {new Date(draft.scheduledAt).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
