import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function PortfolioPage() {
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => backend.website.listProjects(),
  });

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Our <span className="text-launch-orange">Portfolio</span>
            </h1>
            <p className="text-xl text-rocket-gray max-w-3xl mx-auto">
              Discover how we've helped businesses launch into the AI future with innovative automation solutions.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-gray-100 border-gray-300 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader className="h-32"></CardHeader>
                  <CardContent className="h-16"></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData?.projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-white border-2 border-gray-400 hover:border-vapor-purple/60 transition-all duration-300 group overflow-hidden shadow-lg"
                >
                  {/* Project Image */}
                  <div className="relative h-48 bg-gradient-to-br from-vapor-purple/20 to-smoky-lavender/20 overflow-hidden">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-vapor-purple/30 flex items-center justify-center">
                          <Star className="w-8 h-8 text-vapor-purple" />
                        </div>
                      </div>
                    )}
                    
                    {project.isFeatured && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-launch-orange/90 text-jet-black">
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    {project.externalUrl && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                          className="bg-cloud-white/90 text-jet-black hover:bg-cloud-white"
                        >
                          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl text-black group-hover:text-vapor-purple transition-colors">
                      {project.title}
                    </CardTitle>
                    {project.description && (
                      <CardDescription className="text-black line-clamp-3">
                        {project.description}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {project.gallery.length > 0 && (
                          <Badge variant="outline" className="text-xs border-gray-500 text-black">
                            {project.gallery.length} image{project.gallery.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      
                      {project.externalUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-black hover:text-vapor-purple hover:bg-vapor-purple/10"
                        >
                          <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                            View Project
                            <ExternalLink className="ml-2 w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {portfolioData?.projects.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-6">
                <Star className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-cloud-white mb-2">
                Portfolio Coming Soon
              </h3>
              <p className="text-gray-300 max-w-md mx-auto">
                We're working on showcasing our amazing AI automation projects. Check back soon!
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 rounded-2xl p-8 lg:p-12 border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-3xl font-bold font-['Architects_Daughter'] mb-4 text-black">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                Let's discuss how we can create a custom AI solution for your business.
              </p>
              <Button 
                size="lg" 
                className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]"
                asChild
              >
                <a href="/contact">Start Your Project</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
