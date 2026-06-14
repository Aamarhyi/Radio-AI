import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for a single weekend getaway.",
    features: [
      "1 Saved Trip",
      "Basic AI Itinerary",
      "Web Access Only",
      "Standard Map View",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Premium",
    price: "$9.99",
    period: "/mo",
    description: "The ultimate tool for frequent travelers.",
    features: [
      "Unlimited Saved Trips",
      "Advanced AI Optimization",
      "Offline Access (PWA)",
      "Budget Tracking & Insights",
      "Real-time Collaboration",
      "PDF & Calendar Exports",
    ],
    cta: "Upgrade to Premium",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For travel agencies and group coordinators.",
    features: [
      "Custom Branding",
      "Team Management",
      "API Access",
      "Priority AI Generation",
      "Dedicated Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your next adventure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-xl scale-105 z-10' : 'border-border'}`}>
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
