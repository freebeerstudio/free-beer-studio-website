import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import backend from '~backend/client';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    message: '',
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: backend.website.submitContact,
    onSuccess: (response) => {
      toast({
        title: 'Success!',
        description: response.message,
      });
      setFormData({ name: '', email: '', topic: '', message: '' });
    },
    onError: (error) => {
      console.error('Contact error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      topic: formData.topic as "support" | "quote" | "question",
      message: formData.message,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-jet-black text-cloud-white">
      <Header />
      
      <div className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold font-['Architects_Daughter'] mb-4">
              Let's <span className="text-launch-orange">Launch Together</span>
            </h1>
            <p className="text-xl text-rocket-gray max-w-3xl mx-auto">
              Ready to transform your business with AI? We'd love to hear from you. Drop us a message and let's discuss your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-2 border-black shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-black font-['Architects_Daughter']">
                    Send us a message
                  </CardTitle>
                  <CardDescription className="text-black">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">
                          Name *
                        </label>
                        <Input
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-white border-black text-black placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">
                          Email *
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="bg-white border-black text-black placeholder:text-gray-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">
                        Topic *
                      </label>
                      <Select value={formData.topic} onValueChange={(value) => handleInputChange('topic', value)}>
                        <SelectTrigger className="bg-white border-black text-black">
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-black">
                          <SelectItem value="quote">Get a Quote</SelectItem>
                          <SelectItem value="question">General Question</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-black">
                        Message *
                      </label>
                      <Textarea
                        placeholder="Tell us about your project or question..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="bg-white border-black text-black placeholder:text-gray-500 min-h-[120px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={contactMutation.isPending}
                      className="w-full bg-launch-orange hover:bg-launch-orange/80"
                    >
                      <Send className="mr-2 w-5 h-5" />
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-rocket-gray/10 border-2 border-rocket-gray/40 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-cloud-white">
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-vapor-purple/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-vapor-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-rocket-gray">Email</p>
                      <p className="text-cloud-white font-medium">hello@freebeer.ai</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-launch-orange/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-launch-orange" />
                    </div>
                    <div>
                      <p className="text-sm text-rocket-gray">Business Hours</p>
                      <p className="text-cloud-white font-medium">Mon-Fri 9AM-6PM CST</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-smoky-lavender/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-smoky-lavender" />
                    </div>
                    <div>
                      <p className="text-sm text-rocket-gray">Timezone</p>
                      <p className="text-cloud-white font-medium">US Central Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-vapor-purple/10 to-smoky-lavender/10 border-2 border-vapor-purple/40 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-cloud-white mb-2">
                    Quick Response Guarantee
                  </h3>
                  <p className="text-sm text-rocket-gray">
                    We respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
