import { useQuery } from '@tanstack/react-query';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function PricingPage() {
  const { data: pricingData, isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => backend.website.listPricing(),
  });

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Choose Your <span className="text-launch-orange">Launch Package</span>
            </h1>
            <p className="text-xl text-rocket-gray max-w-3xl mx-auto">
              From startup automation to enterprise AI transformation, we have the right solution for your business.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-rocket-gray/10 border-rocket-gray/20 animate-pulse">
                  <CardHeader className="h-32"></CardHeader>
                  <CardContent className="h-64"></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingData?.items.map((item) => (
                <Card 
                  key={item.id} 
                  className={`relative bg-rocket-gray/10 border-rocket-gray/20 hover:border-vapor-purple/40 transition-colors ${
                    item.isFeatured ? 'ring-2 ring-launch-orange/50' : ''
                  }`}
                >
                  {item.isFeatured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-launch-orange text-jet-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-cloud-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-rocket-gray">
                      {item.description}
                    </CardDescription>
                    <div className="mt-4">
                      {item.price ? (
                        <span className="text-3xl font-bold text-vapor-purple">
                          ${item.price.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-3xl font-bold text-vapor-purple">
                          Custom
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-vapor-purple mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-rocket-gray">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full ${
                        item.isFeatured 
                          ? 'bg-launch-orange hover:bg-launch-orange/80' 
                          : 'bg-vapor-purple/20 hover:bg-vapor-purple/30 text-vapor-purple border border-vapor-purple/40'
                      }`}
                      variant={item.isFeatured ? 'default' : 'outline'}
                    >
                      {item.price ? 'Get Started' : 'Contact Us'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold font-['Architects_Daughter'] mb-8">
              Questions? We're here to help.
            </h2>
            <Button 
              variant="outline" 
              size="lg"
              className="border-vapor-purple text-vapor-purple hover:bg-vapor-purple/10"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
