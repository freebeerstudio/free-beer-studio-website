import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Send, Check, X, ExternalLink, ChevronDown, ChevronUp, Rss, Trash2, CheckCircle, XCircle, FileText, Upload, Settings } from 'lucide-react';
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
import FileUpload from '../../components/ui/file-upload';

export default function AdminIdeasPage() {
  const [newIdeaInput, setNewIdeaInput] = useState('');
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [feedSourcesExpanded, setFeedSourcesExpanded] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const [styleGuidesExpanded, setStyleGuidesExpanded] = useState(false);
  const [styleGuideData, setStyleGuideData] = useState<{[key: string]: {
    guidelines: string;
    prompt: string;
    exampleFiles: string[];
  }}>({});
  const backend = useBackend();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Define platforms at component level so both IdeaCard and StyleGuides can access it
  const platforms = [
    { id: 'blog', label: 'Blog', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'substack_lead', label: 'Substack Lead', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'substack_article', label: 'Substack Article', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'substack_mention', label: 'Substack Mention', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'linkedin', label: 'LinkedIn', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { id: 'x', label: 'X', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { id: 'shorts', label: 'Shorts', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

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

  // Reject idea mutation
  const rejectMutation = useMutation({
    mutationFn: (id: number) => backend.ideas.rejectIdea({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ideas'] });
      toast({
        title: 'Success',
        description: 'Idea rejected',
      });
    },
    onError: (error) => {
      console.error('Reject error:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject idea',
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

  const handleRejectIdea = (ideaId: number) => {
    rejectMutation.mutate(ideaId);
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

            {/* Style Guides Section */}
            <Card className="bg-white border-gray-200">
              <CardHeader className="cursor-pointer" onClick={() => setStyleGuidesExpanded(!styleGuidesExpanded)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 flex items-center">
                      <Settings className="mr-2 w-5 h-5" />
                      Channel Style Guides
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Configure writing styles, examples, and AI prompts for each channel
                    </CardDescription>
                  </div>
                  {styleGuidesExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              
              {styleGuidesExpanded && (
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {platforms.map((platform) => (
                      <StyleGuideCard
                        key={platform.id}
                        platform={platform}
                        data={styleGuideData[platform.id] || { guidelines: '', prompt: '', exampleFiles: [] }}
                        onUpdate={(data) => setStyleGuideData(prev => ({ ...prev, [platform.id]: data }))}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            {ideasLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80 bg-white border-gray-200 animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {ideasData?.ideas.length === 0 ? (
                  <Card className="bg-white border-gray-200">
                    <CardContent className="text-center py-12">
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas yet</h3>
                          <p className="text-gray-600">Start by adding content or scraping RSS feeds to generate ideas!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideasData?.ideas.map((idea) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        platforms={platforms}
                        onApprove={handleApproveIdea}
                        onReject={handleRejectIdea}
                        isApproving={approveMutation.isPending}
                        isRejecting={rejectMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </>
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
  platforms: Array<{ id: string; label: string; color: string; }>;
  onApprove: (ideaId: number, platforms: string[]) => void;
  onReject: (ideaId: number) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

function IdeaCard({ idea, platforms, onApprove, onReject, isApproving, isRejecting }: IdeaCardProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(p => p !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleApprove = () => {
    if (selectedPlatforms.length > 0) {
      onApprove(idea.id, selectedPlatforms);
      setIsEditing(false);
    }
  };

  const handleReject = () => {
    onReject(idea.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    // TODO: Fetch existing platform selections from backend
    setSelectedPlatforms([]);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPlatforms([]);
  };

  const getStatusBadge = () => {
    switch (idea.status) {
      case 'new':
        return <Badge className="bg-vapor-purple/20 text-vapor-purple border-vapor-purple">New</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const showControls = idea.status === 'new' || isEditing;
  const showEditButton = idea.status === 'approved' && !isEditing;

  return (
    <Card className="h-full flex flex-col bg-white border-gray-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {idea.title || 'Untitled Idea'}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Badge variant="outline" className="text-xs">
                {idea.inputType === 'url' ? 'Web' : 'Text'}
              </Badge>
            </div>
          </div>
          
          {idea.canonicalUrl && (
            <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
              <a href={idea.canonicalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 pb-3">
        <div className="space-y-3">
          {/* Summary */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {idea.summary}
          </p>

          {/* URL */}
          {idea.canonicalUrl && (
            <div className="p-2 bg-gray-50 rounded text-xs">
              <span className="text-gray-500">Source: </span>
              <a 
                href={idea.canonicalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {idea.canonicalUrl}
              </a>
            </div>
          )}

          {/* Existing Platform Tags for Approved Items */}
          {idea.status === 'approved' && selectedPlatforms.length > 0 && !isEditing && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-700">Published to:</span>
              <div className="flex flex-wrap gap-1">
                {selectedPlatforms.map(platformId => {
                  const platform = platforms.find(p => p.id === platformId);
                  return (
                    <Badge 
                      key={platformId}
                      className={platform?.color || 'bg-gray-100 text-gray-800 border-gray-200'}
                      variant="outline"
                    >
                      {platform?.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Controls */}
      <CardContent className="pt-0">
        {showControls && (
          <div className="space-y-3 border-t border-gray-100 pt-3">
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">
                {isEditing ? 'Edit Platforms:' : 'Select Platforms:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <label 
                    key={platform.id} 
                    className="flex items-center space-x-2 cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <span className="text-sm text-gray-900 flex-1">
                      {platform.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected platforms preview */}
            {selectedPlatforms.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs text-gray-600">Selected:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return (
                      <Badge 
                        key={platformId}
                        className={platform?.color || 'bg-gray-100 text-gray-800 border-gray-200'}
                        variant="outline"
                      >
                        {platform?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={selectedPlatforms.length === 0 || isApproving}
                    size="sm"
                    className="flex-1 bg-smoky-lavender hover:bg-smoky-lavender/80"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={selectedPlatforms.length === 0 || isApproving}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isRejecting}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {showEditButton && (
          <div className="border-t border-gray-100 pt-3">
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="w-full border-smoky-lavender text-smoky-lavender hover:bg-smoky-lavender/10"
            >
              Edit Platforms
            </Button>
          </div>
        )}

        {/* Metadata for non-editable items */}
        {!showControls && !showEditButton && (
          <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-1">
            <div>Added: {new Date(idea.createdAt).toLocaleDateString()}</div>
            <div>Source: {idea.inputType === 'url' ? 'Web Article' : 'Manual Entry'}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StyleGuideCardProps {
  platform: {
    id: string;
    label: string;
    color: string;
  };
  data: {
    guidelines: string;
    prompt: string;
    exampleFiles: string[];
  };
  onUpdate: (data: { guidelines: string; prompt: string; exampleFiles: string[] }) => void;
}

function StyleGuideCard({ platform, data, onUpdate }: StyleGuideCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localData, setLocalData] = useState(data);

  // Update local data when prop changes
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFileUploaded = (url: string, fileId: string) => {
    const newExampleFiles = [...(localData.exampleFiles || []), url];
    const newData = { ...localData, exampleFiles: newExampleFiles };
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleFileRemoved = (index: number) => {
    const newExampleFiles = (localData.exampleFiles || []).filter((_, i) => i !== index);
    const newData = { ...localData, exampleFiles: newExampleFiles };
    setLocalData(newData);
    onUpdate(newData);
  };

  const handleGuidelinesChange = (guidelines: string) => {
    const newData = { ...localData, guidelines };
    setLocalData(newData);
    onUpdate(newData);
  };

  const handlePromptChange = (prompt: string) => {
    const newData = { ...localData, prompt };
    setLocalData(newData);
    onUpdate(newData);
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={platform.color} variant="outline">
              {platform.label}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              {(localData.exampleFiles?.length || 0) > 0 && (
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  {localData.exampleFiles?.length || 0} example{(localData.exampleFiles?.length || 0) !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Writing Guidelines */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Writing Guidelines
            </label>
            <Textarea
              placeholder={`Enter writing guidelines for ${platform.label}...\nE.g., tone, style, length, formatting rules, etc.`}
              value={localData.guidelines}
              onChange={(e) => handleGuidelinesChange(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[100px]"
            />
          </div>

          {/* AI Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              AI Writing Prompt
            </label>
            <Textarea
              placeholder={`Enter AI instructions for writing ${platform.label} content...\nE.g., "Write in a professional tone with bullet points. Keep under 500 words. Include a call-to-action."`}
              value={localData.prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 min-h-[80px]"
            />
          </div>

          {/* Example Files */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Writing Examples
            </label>
            
            {/* Existing files */}
            {(localData.exampleFiles?.length || 0) > 0 && (
              <div className="space-y-2">
                {(localData.exampleFiles || []).map((fileUrl, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <a 
                        href={fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Example {index + 1}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemoved(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* File upload */}
            <FileUpload
              onFileUploaded={handleFileUploaded}
              category="styleguide"
              accept="*/*"
              className="border-dashed border-gray-300"
            />
          </div>
        </CardContent>
      )}
    </Card>
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
