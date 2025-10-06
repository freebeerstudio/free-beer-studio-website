import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => backend.website.getBlogPost({ slug: slug! }),
    enabled: !!slug,
  });

  const renderBlogContent = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let key = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="list-disc list-inside space-y-2 mb-6 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="text-rocket-gray leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={`h1-${key++}`} className="text-4xl font-bold text-cloud-white mb-6 mt-12 first:mt-0 font-['Architects_Daughter']">
            {trimmedLine.substring(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={`h2-${key++}`} className="text-3xl font-bold text-cloud-white mb-4 mt-10 font-['Architects_Daughter']">
            {trimmedLine.substring(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={`h3-${key++}`} className="text-2xl font-bold text-cloud-white mb-3 mt-8 font-['Architects_Daughter']">
            {trimmedLine.substring(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        currentList.push(trimmedLine.substring(2));
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        flushList();
        elements.push(
          <p key={`strong-${key++}`} className="text-cloud-white font-bold mb-4 leading-relaxed">
            {trimmedLine.substring(2, trimmedLine.length - 2)}
          </p>
        );
      } else if (trimmedLine === '') {
        flushList();
        // Skip empty lines
      } else {
        flushList();
        // Process inline bold
        const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={`p-${key++}`} className="text-rocket-gray mb-4 leading-relaxed">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-cloud-white font-semibold">{part.substring(2, part.length - 2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jet-black text-cloud-white">
        <Header />
        <div className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-rocket-gray/20 rounded mb-8 w-1/3"></div>
              <div className="h-16 bg-rocket-gray/20 rounded mb-8"></div>
              <div className="h-64 bg-rocket-gray/20 rounded mb-8"></div>
              <div className="space-y-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-rocket-gray/20 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-jet-black text-cloud-white">
        <Header />
        <div className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-cloud-white mb-4">Post Not Found</h1>
            <p className="text-rocket-gray mb-8">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild variant="outline">
              <Link to="/blog">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      <article className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-rocket-gray hover:text-cloud-white">
              <Link to="/blog">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Blog
              </Link>
            </Button>
          </div>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] text-cloud-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.subtitle && (
              <p className="text-xl text-rocket-gray mb-6 leading-relaxed">
                {post.subtitle}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-6 text-sm text-rocket-gray">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(post.publishedAt ? post.publishedAt.toString() : null)}
                </div>
                {post.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author.email}
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-rocket-gray text-rocket-gray hover:text-cloud-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.coverImageUrl && (
            <div className="mb-12">
              <img
                src={post.coverImageUrl}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-xl border border-rocket-gray/20"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="max-w-none">
            {post.body ? (
              <div className="space-y-4">
                {renderBlogContent(post.body)}
              </div>
            ) : (
              <p className="text-rocket-gray">No content available.</p>
            )}
          </div>

          {/* Gallery */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-cloud-white mb-6">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.gallery.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${post.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-rocket-gray/20"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <Card className="mt-16 bg-gradient-to-r from-vapor-purple/10 to-smoky-lavender/10 border-vapor-purple/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-black mb-4 font-['Architects_Daughter']">
                Ready to Launch Your AI Project?
              </h3>
              <p className="text-black mb-6 max-w-2xl mx-auto">
                Inspired by what you've read? Let's discuss how we can help transform your business with AI automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-launch-orange hover:bg-launch-orange/80">
                  <Link to="/contact">Get Started</Link>
                </Button>
                <Button asChild variant="outline" className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10">
                  <Link to="/portfolio">View Our Work</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      <Footer />
    </div>
  );
}
