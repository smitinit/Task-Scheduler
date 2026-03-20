import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TaskFlowAnimation from '@/components/TaskFlowAnimation'

export default function LandingPage() {
  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Smart Task Scheduling',
      description:
        'Intelligent task scheduling with real-time updates and instant notifications',
    },
    {
      icon: <Flame className="h-6 w-6" />,
      title: 'Focus Sessions',
      description:
        'Dedicated focus blocks to maintain productivity and deep work sessions',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Insights & Analytics',
      description:
        'Track your productivity patterns with detailed weekly and hourly analytics',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Calendar Integration',
      description: 'Seamless calendar view with drag-and-drop task scheduling',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: 'Progress Tracking',
      description:
        'Monitor completed, scheduled, and missed tasks with live statistics',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Private',
      description:
        'Your tasks are secure with encrypted storage and privacy-first design',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Tasks',
      description: 'Add tasks with specific time slots and focus session modes',
    },
    {
      number: '02',
      title: 'Get Notifications',
      description: 'Receive smart notifications before tasks start',
    },
    {
      number: '03',
      title: 'Track Progress',
      description: 'Monitor completion rates and productivity patterns',
    },
    {
      number: '04',
      title: 'Optimize & Improve',
      description:
        'Use insights to optimize your schedule and boost productivity',
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Master Your{' '}
            <span className="bg-linear-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
              Schedule
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform how you manage tasks with intelligent scheduling,
            real-time notifications, and powerful analytics. Stay on top of
            everything that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Start For Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Workflow Section */}
        <div className="mt-20 text-center space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            The complete workflow
          </p>
          <h3 className="text-2xl md:text-3xl font-semibold">
            From task creation to smart insights
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how Task Scheduler transforms your tasks through intelligent
            scheduling, real-time notifications, and automatic insights — all in
            one seamless workflow.
          </p>
        </div>

        {/* Hero Animation */}
        <div className="mt-12 rounded-lg border bg-card shadow-lg overflow-hidden">
          <div className="aspect-video">
            <TaskFlowAnimation />
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Our Purpose</h2>
            <p className="text-lg text-muted-foreground">
              Why Task Scheduler exists and what we're solving
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3">The Problem</h3>
              <p className="text-muted-foreground leading-relaxed">
                Most people struggle with task management. They lose track of
                deadlines, miss opportunities to focus on important work, and
                lack visibility into their productivity patterns. Traditional
                task apps are either too simple or overwhelming, leaving users
                frustrated and unproductive.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3">Our Solution</h3>
              <p className="text-muted-foreground leading-relaxed">
                Task Scheduler combines intelligent scheduling, real-time
                notifications, and powerful analytics into one beautiful,
                intuitive platform. We help you not just manage tasks, but
                master your time—enabling better focus, higher productivity, and
                meaningful insights into your work patterns.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower professionals and teams to reclaim control of their
                time, eliminate context-switching chaos, and achieve more by
                working smarter, not harder. We believe that effective task
                management is the foundation of personal and professional
                success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to organize, schedule, and optimize your
            workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes and see the difference in your productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg mx-auto">
                {step.number}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '500K+', label: 'Tasks Scheduled' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'Support' },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">
                {stat.number}
              </p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-lg border bg-linear-to-r from-purple-500/10 to-orange-500/10 p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to transform your productivity?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of users who are already mastering their schedules
            with Task Scheduler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2">
                Get Started For Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
