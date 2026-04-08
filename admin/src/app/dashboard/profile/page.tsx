"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MapPin,
  Phone,
  Briefcase,
  Github,
  Linkedin,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "shadcn/ui",
  ];

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-muted/30 px-4 py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden rounded-2xl">
            <div className="h-40 bg-linear-to-r from-primary/20 via-primary/10 to-transparent" />

            <CardContent className="relative px-6 pb-6">
              <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                    <AvatarFallback>MA</AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-bold">Mohammad Al Amin</h1>
                      <Badge>Full Stack Developer</Badge>
                    </div>

                    <p className="max-w-2xl text-sm text-muted-foreground mt-10">
                      I’m a Full Stack Developer focused on building scalable,
                      modern, and user-friendly web applications with clean code
                      and great user experience.
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Bangladesh
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        alamin@example.com
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        +8801XXXXXXXXX
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Open to work
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button disabled variant="default">
                    Hire Me
                  </Button>
                  <Button disabled variant="outline">
                    Download CV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>25+</CardTitle>
                <CardDescription>Completed Projects</CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>3+ Years</CardTitle>
                <CardDescription>Experience</CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>15+</CardTitle>
                <CardDescription>Happy Clients</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Main Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Side */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Technologies I work with</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>Connect with me</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>

                  <a
                    href="https://yourportfolio.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-4 w-4" />
                    Portfolio
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Right Side */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                      <CardDescription>
                        A quick introduction about me
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground leading-6">
                      <p>
                        I specialize in building full stack applications using
                        Next.js, React, Node.js, and modern UI systems like
                        shadcn/ui.
                      </p>
                      <p>
                        I enjoy solving real-world business problems, building
                        dashboards, admin panels, APIs, authentication systems,
                        and scalable backend architecture.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="experience" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Experience</CardTitle>
                      <CardDescription>My recent work journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold">Full Stack Developer</h3>
                        <p className="text-sm text-muted-foreground">
                          RTEMIS Ltd • 2023 - February-2026
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Building scalable web applications, dashboards, APIs,
                          and business solutions.
                        </p>
                      </div>

                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold">Frontend Developer</h3>
                        <p className="text-sm text-muted-foreground">
                          Freelance • 2022 - 2023
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Developed responsive UI, landing pages, and modern web
                          experiences for clients.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-4">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Projects</CardTitle>
                      <CardDescription>Some featured projects</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold">Investment Platform</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          A modern investment management platform with admin
                          panel, authentication, and role-based access.
                        </p>
                      </div>

                      <div className="rounded-xl border p-4">
                        <h3 className="font-semibold">Task Management App</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          A task and team collaboration app with status
                          tracking, assignments, and clean dashboard UI.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
