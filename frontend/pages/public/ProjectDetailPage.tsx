import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => backend.website.getProject({ id: parseInt(id || '0', 10) }),
    enabled: !!id,
  });

  if (error) {
    return (
      <div className="min-h-screen bg-jet-black text-cloud-white">
        <Header />
        <div className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-cloud-white mb-4">Project Not Found</h2>
              <p className="text-rocket-gray mb-8">The project you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/portfolio">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Portfolio
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-8 text-cloud-white hover:text-launch-orange">
            <Link to="/portfolio">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Portfolio
            </Link>
          </Button>

          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-8"></div>
              <div className="h-96 bg-gray-700 rounded mb-8"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          ) : project ? (
            <div>
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] text-launch-orange">
                    {project.title}
                  </h1>
                  {project.isFeatured && (
                    <Badge className="bg-launch-orange/20 text-launch-orange border-launch-orange">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-rocket-gray">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {project.externalUrl && (
                    <Button variant="outline" size="sm" asChild className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10">
                      <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                        View Live Project
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {project.coverImageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden border-2 border-vapor-purple/30 shadow-2xl">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="w-full h-auto max-h-[600px] object-cover"
                  />
                </div>
              )}

              {project.description && (
                <Card className="bg-gray-900/50 border-vapor-purple/30 p-8 mb-8">
                  <h2 className="text-2xl font-bold text-cloud-white mb-4">About This Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-rocket-gray whitespace-pre-wrap leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </Card>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-cloud-white mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.gallery.map((imageUrl, index) => (
                      <div 
                        key={index} 
                        className="rounded-lg overflow-hidden border-2 border-vapor-purple/20 hover:border-vapor-purple/60 transition-all duration-300 shadow-lg group"
                      >
                        <img
                          src={imageUrl}
                          alt={`${project.title} - Image ${index + 1}`}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 rounded-2xl p-8 border-2 border-vapor-purple/30">
                <h2 className="text-2xl font-bold font-['Architects_Daughter'] mb-4 text-cloud-white">
                  Interested in a Similar Project?
                </h2>
                <p className="text-lg text-rocket-gray mb-6">
                  Let's discuss how we can create a custom AI solution tailored to your business needs.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-launch-orange hover:bg-launch-orange/90 text-jet-black"
                    asChild
                  >
                    <Link to="/contact">Get in Touch</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10"
                    asChild
                  >
                    <Link to="/portfolio">View More Projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
