import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Code, Palette, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import TiltImage from '../components/TiltImage';
import MagicBento from '@/components/MagicBento';
import { ParticleCard } from '@/components/MagicBento';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
              About the Developer
            </Badge>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
              Meet the Creator
              <span className="block text-emerald-400">Behind FinanceFlow</span>
            </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
              Hi! I'm <span className="font-semibold bg-gradient-to-r from-emerald-400 via-yellow-300 to-emerald-600 bg-clip-text text-transparent animate-shine bg-[length:200%_100%] bg-left">Kudala Bharani Kumar Reddy</span>, a full stack web developer who designed and built FinanceFlow. 
              This project was created with passion for helping people manage their finances better.
            </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 group"
                onClick={() => navigate('/contact')}
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-background text-white font-semibold px-8 py-4 rounded-xl shadow-lg border-2 border-white/80 flex items-center gap-2 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition-colors duration-300 group"
                onClick={() => window.open('https://your-portfolio-link.com', '_blank')}
              >
                <span className="absolute inset-0 z-0 bg-white scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 ease-out rounded-xl" aria-hidden="true"></span>
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-300 group-hover:text-black">
                  <Palette className="w-5 h-5 text-emerald-500" />
                  See My Work
                </span>
              </Button>
              </div>
            </div>
            
            {/* Right - Profile Card */}
            <div className="flex justify-center">
              <TiltImage
                src="/screenshots/creator/hero.jpg"
                alt="Bharani Kudala"
                width={320}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              About This Project
            </h2>
            <p className="text-xl text-muted-foreground">
              FinanceFlow was designed and developed as a personal finance management application.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-8">
            <ParticleCard enableTilt={true} enableMagnetism={true} enableBorderGlow={true} clickEffect={true} particleCount={12} glowColor="132, 0, 255">
              <Card className="bg-card border border-border shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Built with Modern Tech</h3>
                  <p className="text-muted-foreground">
                    React, TypeScript, Tailwind CSS, and modern web technologies
                  </p>
                </CardContent>
              </Card>
            </ParticleCard>
            <ParticleCard enableTilt={true} enableMagnetism={true} enableBorderGlow={true} clickEffect={true} particleCount={12} glowColor="132, 0, 255">
              <Card className="bg-card border border-border shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
                  <p className="text-muted-foreground">
                    Clean, modern UI with focus on user experience
                  </p>
                </CardContent>
              </Card>
            </ParticleCard>
            <ParticleCard enableTilt={true} enableMagnetism={true} enableBorderGlow={true} clickEffect={true} particleCount={12} glowColor="132, 0, 255">
              <Card className="bg-card border border-border shadow-lg rounded-xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
                  <p className="text-muted-foreground">
                    Optimized for performance across all devices
                  </p>
                </CardContent>
              </Card>
            </ParticleCard>
          </div>

          <ParticleCard enableTilt={true} enableMagnetism={true} enableBorderGlow={true} clickEffect={true} particleCount={12} glowColor="132, 0, 255">
          <Card className="bg-card border border-border shadow-lg rounded-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Made with Love</h3>
                <p className="text-muted-foreground">
                  This project was created with passion for helping people achieve their financial goals.
                </p>
              </div>
              
              <div className="space-y-4 text-center">
                <p className="text-lg">
                  FinanceFlow is more than just a finance app - it's a tool designed to help you 
                  take control of your financial future. Every feature was carefully crafted to 
                  make managing your money simple and intuitive.
                </p>
                <p className="text-muted-foreground">
                  Whether you're tracking expenses, setting budgets, or planning for the future, 
                  FinanceFlow provides the tools you need to succeed.
                </p>
              </div>
            </CardContent>
          </Card>
          </ParticleCard>
        </div>
      </section>


    </div>
  );
} 