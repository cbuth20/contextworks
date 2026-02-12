import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="relative max-w-3xl mx-auto text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Strategic Consulting & Document Management
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          Transform your business with strategic context.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          ContextWorks delivers tailored consulting solutions that drive measurable results.
          We combine deep industry expertise with data-driven strategies to help your business thrive.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/about">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Client Portal</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
