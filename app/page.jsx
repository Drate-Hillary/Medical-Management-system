import Pricing from "@/components/pricing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { creditBenefits, features, testimonials } from "@/lib/data";
import { ArrowRight, Check, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden py-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>

              <Badge
                variant='outline'
                className="bg-emerald-900/30 border-emerald-700/30 px-4 py-2 text-emerald-500 text-sm font-medium"
              >
                Health made Simple
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connect with Doctors
                <br />{" "}
                <span className="bg-gradient-to-b from-emerald-500 to-teal-400 font-bold text-transparent bg-clip-text pb-1 pr-2">Anytime, Anywhere</span>
              </h1>

              <p className="text-muted-foreground text-sm md:text-xl max-w-md">
                Book appointment, consult via video, and manage your healthcare journey all in one secure platform
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                  <Link href={"/onboarding"}>
                    Getted Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="bg-emerald-700/30 text-white hover:bg-muted/80">
                  <Link href={"/doctors"}>Find Doctors</Link>
                </Button>

              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/banner2.png"
                alt="Doctors"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes healthcare accessible with just simple clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className='bg-emerald-900/20 hover:bg-emerald-800/10 transition-all duration-300 cursor-pointer'
                >
                  <CardHeader className="flex flex-row gap-8 items-center bg-emerald-900/20 p-3 rounded w-full mb-4" >
                    <div >
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge
              variant='outline'
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 mb-4 text-emerald-500 text-sm font-medium"
            >
              Affordable Healthcare
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Consultation Packages
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the prefect consultation package that fits your healthcare
            </p>
          </div>

          <Pricing/>

          <div>
            <Card className="mt-4 bg-muted/20 border-emerald-900/30">
              <CardHeader>
                <Stethoscope className="h-5 w-5 mr-2 text-emerald-400" />
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  How our credit system works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {creditBenefits.map((benefit, index) => {
                    return (
                      <li key={index} className="flex items-center">
                        <div className="mr-3 mt-1 bg-emerald-900/20 p-1 rounded-full flex">
                          <Check className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p
                          className="text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: benefit }}
                        />
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-10 bg-muted/30">
        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <Badge
              variant='outline'
              className="bg-emerald-900/30 border-emerald-700/30 px-4 py-1 mb-4 text-emerald-500 text-sm font-medium"
            >
              Success Stories
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What our Patients say
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from patients and doctors who use our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testimonials.map((testimonial, index) => {
              return (
                <Card
                  key={index}
                  className='bg-emerald-900/20 hover:bg-emerald-800/10 transition-all duration-300 cursor-pointer'
                >
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mr-4">
                        <span className="text-emerald-400 font-bold">{testimonial.initials}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-muted-foreground ">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-md">
                      &quot;{testimonial.quote}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <Card
            className='bg-gradient-to-r from-emerald-900/20 to-emerald-950/10 border-emerald-200 cursor-pointer'
          >
            <CardContent className="p-4 md:p-6 lg:p-8 relative overflow-hidden">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to take control of your healthcare?
                </h2>

                <p className="mt-1">
                  Join thousands of users who have simplified their healthcare 
                  journey with our platform. Get started today and experience 
                  healthcare the way it should be.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-5">
                  <Button asChild size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700">
                    <Link href="/sign-up">Sign Up Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-emerald-700/30 text-white hover:bg-muted/30">
                    <Link href="/pricing">View Pricing</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
