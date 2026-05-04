"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Users, Heart, BookOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useStaff } from '@/hooks/useStaff';
import { usePublicAbout } from '@/hooks/usePublicContent';
import { EmptyState } from '@/components/shared/EmptyState';

export default function About() {
  const router = useRouter();
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const { data: about } = usePublicAbout();

  const fallbackTimeline = [
    { year: '2015', title: 'Founded', desc: 'Loving Family Daycare started with a single classroom and 5 children in Lagos.' },
    { year: '2017', title: 'Expansion', desc: 'Added toddler and preschool programs with dedicated play areas.' },
    { year: '2019', title: 'Accreditation', desc: 'Received national accreditation for early childhood education excellence.' },
    { year: '2021', title: 'Digital Platform', desc: 'Launched parent portal for real-time updates, attendance, and payments.' },
    { year: '2024', title: '250+ Families', desc: 'Serving over 250 families with a team of 18 qualified educators.' },
  ];

  const fallbackValues = [
    { icon: Heart, title: 'Love & Care', desc: 'Every child deserves to feel loved, safe, and valued every single day.' },
    { icon: BookOpen, title: 'Learning Excellence', desc: 'Research-based curriculum designed to foster curiosity and critical thinking.' },
    { icon: Users, title: 'Inclusivity', desc: 'Celebrating diversity and creating an environment where every child belongs.' },
    { icon: Award, title: 'Integrity', desc: 'Honest, transparent communication with parents in all we do.' },
  ];
  const iconMap = { heart: Heart, book: BookOpen, users: Users, award: Award };
  const timeline = about?.timeline?.length
    ? about.timeline.map((item) => ({ year: item.year ?? "", title: item.title ?? "", desc: item.description ?? "" }))
    : fallbackTimeline;
  const values = about?.values?.length
    ? about.values.map((item) => ({
        icon: iconMap[(item.icon?.toLowerCase() as keyof typeof iconMap) ?? ""] ?? Heart,
        title: item.title ?? "",
        desc: item.description ?? "",
      }))
    : fallbackValues;
  const awards = about?.awards?.length
    ? about.awards
    : [
        'National Association of Early Childhood Educators',
        'Ministry of Education Certified',
        'Child Safety Excellence Award 2023',
        'ISO 9001 Quality Management',
      ];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
        <Image src={about?.heroImageUrl ?? "/images/about-hero.jpg"} alt="About Loving Family" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-green/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl lg:text-5xl font-display font-bold text-white mb-2">{about?.heroTitle ?? "About Us"}</h1>
            <p className="text-white/80 text-sm lg:text-base">{about?.heroSubtitle ?? "Our story, mission, and the team behind Loving Family"}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-16 lg:space-y-24">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-green rounded-xl p-6 lg:p-8 text-white">
            <Badge className="bg-yellow/20 text-yellow border-yellow/30 mb-4">Our Mission</Badge>
            <h2 className="text-xl lg:text-2xl font-display font-bold mb-3">{about?.missionTitle ?? "Nurturing Tomorrow's Leaders Today"}</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {about?.missionBody ?? "To provide a safe, loving, and stimulating environment where children can develop socially, emotionally, physically, and intellectually through play-based learning and guided discovery."}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-teal rounded-xl p-6 lg:p-8 text-white">
            <Badge className="yellow-50/20 text-white border-white/30 mb-4">Our Vision</Badge>
            <h2 className="text-xl lg:text-2xl font-display font-bold mb-3">{about?.visionTitle ?? "The Premier Daycare in Nigeria"}</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              {about?.visionBody ?? "To be the most trusted and sought-after early childhood education institution in Nigeria, recognized for excellence in child development, innovation in education, and unwavering commitment to families."}
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-yellow text-yellow">Our Journey</Badge>
            <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Our Story</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-px" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start gap-6 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`hidden lg:block lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-10' : 'lg:text-left lg:pl-10'}`}>
                    <div className={`yellow-50 rounded-xl p-5 shadow-soft inline-block text-left ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                      <span className="text-yellow font-display font-bold text-lg">{item.year}</span>
                      <h3 className="font-display font-semibold text-green mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-yellow rounded-full border-2 border-white shadow -translate-x-1.5 mt-1.5 lg:-translate-x-1.5 z-10" />
                  <div className="lg:hidden ml-10 yellow-50 rounded-xl p-5 shadow-soft flex-1">
                    <span className="text-yellow font-display font-bold text-lg">{item.year}</span>
                    <h3 className="font-display font-semibold text-green mt-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-teal text-teal">What We Believe</Badge>
            <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="yellow-50 rounded-xl p-6 shadow-soft text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-green/5 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-green" />
                </div>
                <h3 className="text-lg font-display font-semibold text-green mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-yellow text-yellow">Our Team</Badge>
            <h2 className="text-2xl lg:text-4xl font-display font-bold text-green">Meet Our Team</h2>
          </div>
          {staffLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-xl bg-muted" />)}
            </div>
          ) : staff.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.filter((member) => member.isActive).slice(0, 8).map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="yellow-50 rounded-xl overflow-hidden shadow-soft hover:shadow-lift transition-shadow"
              >
                {member.photo ? (
                  <Image src={member.photo} alt={member.name} width={360} height={360} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-muted text-3xl font-display font-bold text-green">
                    {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-green">{member.name}</h3>
                  <p className="text-xs text-teal font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
          ) : (
            <EmptyState title="No staff profiles published" description="Active staff records from the staff API will appear here." />
          )}
        </div>

        {/* Accreditations */}
        <div className="bg-background rounded-2xl p-6 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-display font-bold text-green">Accreditations & Awards</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {awards.map((award) => (
              <div key={award} className="flex items-center gap-2 yellow-50 rounded-full px-4 py-2 shadow-xs">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-green font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-display font-bold text-green mb-4">Ready to Join Our Family?</h2>
          <Button className="bg-yellow text-green hover:bg-yellow-400 font-semibold rounded-full px-8" onClick={() => router.push('/register')}>
            Enroll Your Child <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
