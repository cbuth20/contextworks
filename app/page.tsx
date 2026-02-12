import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Footer } from '@/components/landing/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Settings, Search, FileText } from 'lucide-react'

const services = [
  {
    title: 'Strategic Planning',
    description: 'Develop comprehensive strategies aligned with your business goals and market dynamics.',
    icon: BarChart3,
  },
  {
    title: 'Operational Excellence',
    description: 'Streamline operations and implement best practices to maximize efficiency and output.',
    icon: Settings,
  },
  {
    title: 'Market Analysis',
    description: 'Deep dive into market trends, competitive landscapes, and emerging opportunities.',
    icon: Search,
  },
]

const approach = [
  { step: '01', title: 'Discover', description: 'We immerse ourselves in your business to understand the full context of your challenges and opportunities.' },
  { step: '02', title: 'Analyze', description: 'Data-driven analysis reveals patterns, gaps, and untapped potential in your operations and market.' },
  { step: '03', title: 'Strategize', description: 'Tailored strategies backed by evidence and aligned with your unique business objectives.' },
  { step: '04', title: 'Execute', description: 'Hands-on implementation support ensures your strategy translates into measurable results.' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Services */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              Comprehensive consulting solutions designed to elevate every aspect of your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="h-5 w-5 text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 px-4 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Approach</h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
              A proven four-stage methodology that delivers consistent, measurable outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {approach.map((phase) => (
              <div key={phase.step}>
                <span className="text-4xl font-bold text-muted-foreground/20">{phase.step}</span>
                <h3 className="font-semibold mt-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to transform your business?
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Join the businesses that have partnered with ContextWorks to achieve breakthrough results.
          </p>
          <div className="mt-8">
            <a
              href="mailto:connor@contextworks.co"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
