"use client";

import {
  Boxes,
  FileText,
  Key,
  Lock,
  LogOutIcon,
  RefreshCw,
  Shield,
  UserIcon,
  Users,
} from "lucide-react";
import React, { Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthTemplateLanding() {
  const features = [
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "JWT + Refresh Token",
      description:
        "HTTP-only cookies with automatic rotation for maximum security",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "OAuth Integration",
      description: "Seamless login with Google providers",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Two-Factor Authentication",
      description: "TOTP-based 2FA for enhanced account protection",
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Password Recovery",
      description: "Secure forgot password flow with email verification",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Role-Based Access Control",
      description: "Fine-grained permissions and user role management",
    },
    {
      icon: <Boxes className="w-6 h-6" />,
      title: "Ready-to-use UI",
      description: "Clean, minimal components out of the box",
    },
  ];

  const { session, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[5rem]">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8" />
              <span className="text-xl font-bold">SecureAuth</span>
            </div>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Fragment>
                  <p className="font-semibold text-lg">
                    {session?.user.username}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="uppercase">
                          {session?.user?.username?.at(0)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40" align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <UserIcon />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                          onClick={logout}
                        >
                          <LogOutIcon />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Fragment>
              ) : (
                <Fragment>
                  <Link href={"/auth/login"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href={"/auth/register"}>
                    <Button size="sm" className="cursor-pointer">
                      Register
                    </Button>
                  </Link>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium">Production Ready</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Secure Auth Template
            </h1>

            <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade authentication system built with Spring Boot
              backend. Secure, scalable, and ready to integrate into your
              Next.js application.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={"/auth/login"}>
              <Button size="lg" className="text-base px-8 cursor-pointer">
                <Shield className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link
              href={
                "https://github.com/Rovineshutabarat/spring-boot-auth-template"
              }
              target="_blank"
            >
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 cursor-pointer"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Repository
              </Button>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap justify-center gap-6 mb-40 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
              <span>Next.js 14</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <span>Spring Boot</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>TailwindCSS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-600 rounded-sm"></div>
              <span>shadcn/ui</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold  mb-4">
              Authentication Features
            </h2>
            <p className="max-w-2xl mx-auto">
              Everything you need for secure user authentication and
              authorization, built with industry best practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <div>{feature.icon}</div>
                  </div>
                  <CardTitle className="">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm">
            <p>
              &copy; 2025 SecureAuth Template. Built with Next.js & Spring Boot.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
