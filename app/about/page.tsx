import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">About ContextWorks</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A strategic consulting firm built on the principle that context drives results.
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-4">Who We Are</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    ContextWorks is a strategic consulting firm founded by Connor and Patrick, two partners
                    who believe that the best business decisions come from understanding the full picture.
                    We combine analytical rigor with real-world experience to help businesses navigate
                    complexity and achieve sustainable growth.
                  </p>
                  <p>
                    Our name reflects our philosophy: every business challenge exists within a context.
                    Market conditions, organizational culture, competitive dynamics, and stakeholder
                    expectations all shape the path forward. We work to understand that context deeply
                    before recommending action.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-4">What We Do</h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    We provide end-to-end consulting services that span strategy development, operational
                    improvement, market analysis, and organizational transformation. Our approach is
                    hands-on: we don&apos;t just deliver recommendations, we work alongside your team to
                    implement them.
                  </p>
                  <p>
                    Our secure document management platform enables seamless collaboration with clients.
                    From contract reviews to strategic deliverables, every document is organized, tracked,
                    and accessible through our encrypted client portal with digital signing capabilities.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-8">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="font-semibold text-sm">C</span>
                  </div>
                  <h3 className="text-lg font-semibold">Connor</h3>
                  <p className="text-sm text-muted-foreground">Co-Founder & Partner</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Brings deep expertise in strategic planning and business development. Focused on
                    helping clients identify and capitalize on growth opportunities through data-driven
                    decision making.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-4">
                    <span className="font-semibold text-sm">P</span>
                  </div>
                  <h3 className="text-lg font-semibold">Patrick</h3>
                  <p className="text-sm text-muted-foreground">Co-Founder & Partner</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Specializes in operational excellence and organizational transformation. Passionate
                    about building efficient systems and processes that scale with growing businesses.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold mb-6">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-1">Context First</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We invest time understanding your unique situation before proposing solutions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Results Driven</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Every engagement is measured by the tangible outcomes it delivers to your business.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Trust & Security</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Client confidentiality and data security are non-negotiable in everything we do.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-12" />

          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Let&apos;s Work Together</h2>
            <p className="text-muted-foreground mb-6">
              Ready to bring clarity and strategy to your business challenges?
            </p>
            <a
              href="mailto:connor@contextworks.co"
              className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start a Conversation
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
