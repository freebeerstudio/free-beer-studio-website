import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function BlogPage() {
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => backend.website.listBlogPosts({}),
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4 text-black">
              AI Insights & <span className="text-launch-orange">Innovation</span>
            </h1>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Stay ahead of the curve with our latest thoughts on AI automation, industry trends, and practical guides.
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
              {blogData?.posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="bg-white border-2 border-gray-400 hover:border-vapor-purple/60 transition-all duration-300 group overflow-hidden shadow-lg"
                >
                  {/* Post Image */}
                  <div className="relative h-48 bg-gradient-to-br from-vapor-purple/20 to-smoky-lavender/20 overflow-hidden">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-vapor-purple/30 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-vapor-purple" />
                        </div>
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex items-center space-x-4 text-sm text-black mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.publishedAt ? post.publishedAt.toString() : null)}
                      </div>
                      {post.author && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author.email}
                        </div>
                      )}
                    </div>
                    
                    <CardTitle className="text-xl text-black group-hover:text-vapor-purple transition-colors line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    
                    {post.subtitle && (
                      <CardDescription className="text-black line-clamp-2">
                        {post.subtitle}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    {post.excerpt && (
                      <p className="text-black text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-vapor-purple hover:text-smoky-lavender hover:bg-vapor-purple/10 p-0"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        Read more
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {blogData?.posts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Blog Posts Coming Soon
              </h3>
              <p className="text-black max-w-md mx-auto">
                We're working on some great content about AI automation and industry insights. Check back soon!
              </p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 rounded-2xl p-8 lg:p-12 border-2 border-black shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <h2 className="text-3xl font-bold font-['Architects_Daughter'] mb-4 text-black">
                Never Miss an Update
              </h2>
              <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest AI automation insights, tips, and industry news.
              </p>
              <Button 
                size="lg" 
                className="bg-white border-2 border-black text-black hover:bg-black/10 shadow-[0_4px_14px_rgb(0,0,0,0.25)]"
              >
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
