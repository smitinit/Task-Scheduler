import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import TaskFlowAnimation from '@/components/TaskFlowAnimation'

export default function LandingPage() {
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
            <span className="bg-gradient-to-br from-primary to-chart-1 bg-clip-text text-transparent">
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
      </section>

      {/* Workflow Section */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            A Small Visual Animation
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Simple animation showing how tasks flow from creation to completion.
          </p>
        </div>

        {/* Hero Animation */}
        <div className="glass-card mt-12 border overflow-hidden">
          <div className="aspect-video">
            <TaskFlowAnimation />
          </div>
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
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg mx-auto">
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

      {/* Final CTA Section */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-lg border bg-gradient-to-r from-primary/10 to-chart-1/10 p-8 md:p-12 text-center space-y-6">
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
