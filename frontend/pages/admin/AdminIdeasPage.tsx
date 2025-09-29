import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Send, Check, X, ExternalLink, ChevronDown, ChevronUp, Rss, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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

  // Fetch drafts
  const { data: draftsData, isLoading: draftsLoading } = useQuery({
    queryKey: ['admin-drafts'],
    queryFn: () => backend.ideas.listDrafts({}),
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
                      onClick={() => {
                        // TODO: Implement add feed functionality
                        toast({
                          title: 'Coming Soon',
                          description: 'Feed source management will be implemented soon',
                        });
                        setNewFeedName('');
                        setNewFeedUrl('');
                      }}
                      disabled={!newFeedName.trim() || !newFeedUrl.trim()}
                      className="bg-vapor-purple hover:bg-vapor-purple/80"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Add Feed Source
                    </Button>
                  </div>

                  {/* Existing Feed Sources */}
                  <div className="space-y-3">
                    <h4 className="text-gray-900 font-medium">Current Feed Sources</h4>
                    <div className="space-y-2">
                      {/* Sample feed sources - replace with actual data */}
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <Rss className="w-4 h-4 text-vapor-purple" />
                          <div>
                            <p className="text-gray-900 font-medium">Sample Tech Blog</p>
                            <p className="text-gray-600 text-sm">https://example.com/rss</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Active
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: 'Coming Soon',
                                description: 'Feed deletion will be implemented soon',
                              });
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center space-x-3">
                          <Rss className="w-4 h-4 text-vapor-purple" />
                          <div>
                            <p className="text-gray-900 font-medium">Industry News</p>
                            <p className="text-gray-600 text-sm">https://industry-news.com/feed</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-gray-600 border-gray-600">
                            Inactive
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: 'Coming Soon',
                                description: 'Feed deletion will be implemented soon',
                              });
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm italic">
                      Feed source management and automatic scraping functionality will be implemented in the next phase.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            {ideasLoading ? (
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
  
  const platforms = [
    { id: 'blog', label: 'Blog' },
    { id: 'substack', label: 'Substack' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'x', label: 'X (Twitter)' },
    { id: 'shorts', label: 'Shorts' },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-vapor-purple/20 text-vapor-purple';
      case 'approved': return 'bg-smoky-lavender/20 text-smoky-lavender';
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
              {idea.title || 'Untitled Idea'}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={getStatusColor(idea.status)}>{idea.status}</Badge>
              <Badge variant="outline" className="text-gray-600 border-rocket-gray">
                {idea.inputType}
              </Badge>
            </div>
          </div>
          {idea.canonicalUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={idea.canonicalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {idea.summary && (
          <p className="text-gray-600 text-sm">{idea.summary}</p>
        )}
        
        {idea.keyPoints && idea.keyPoints.length > 0 && (
          <div>
            <h4 className="text-gray-900 font-medium mb-2">Key Points:</h4>
            <ul className="list-disc list-inside space-y-1">
              {idea.keyPoints.map((point: string, index: number) => (
                <li key={index} className="text-gray-600 text-sm">{point}</li>
              ))}
            </ul>
          </div>
        )}

        {idea.status === 'new' && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <h4 className="text-gray-900 font-medium mb-2">Select Platforms:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${idea.id}-${platform.id}`}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <label
                      htmlFor={`${idea.id}-${platform.id}`}
                      className="text-sm text-gray-900 cursor-pointer"
                    >
                      {platform.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={() => onApprove(idea.id, selectedPlatforms)}
                disabled={selectedPlatforms.length === 0 || isApproving}
                className="bg-smoky-lavender hover:bg-smoky-lavender/80"
              >
                <Check className="mr-2 w-4 h-4" />
                Approve
              </Button>
              <Button variant="outline" className="border-rocket-gray text-gray-600">
                <X className="mr-2 w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        )}
      </CardContent>
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
