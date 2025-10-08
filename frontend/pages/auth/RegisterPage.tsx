import { SignUp } from '@clerk/clerk-react';
import { Rocket } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-jet-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-vapor-purple/20 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-vapor-purple" />
          </div>
          <h1 className="text-2xl font-bold text-cloud-white font-['Architects_Daughter']">
            Join Free Beer Studio
          </h1>
          <p className="text-rocket-gray mt-2">
            Create your account to get started
          </p>
        </div>

        <div className="flex justify-center">
          <SignUp 
            routing="path" 
            path="/register"
            signInUrl="/login"
            afterSignUpUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
