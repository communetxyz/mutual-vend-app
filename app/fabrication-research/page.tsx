import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download, Star, DollarSign } from "lucide-react"
import Image from "next/image"

const blueprints = [
  {
    id: 1,
    title: "Basic Snack Dispenser",
    description: "Simple gravity-fed mechanism for lightweight snacks",
    difficulty: "Beginner",
    estimatedCost: "$50-100",
    materials: ["Arduino Uno", "Servo Motors", "Acrylic Sheets", "Basic Hardware"],
    features: ["Single product type", "Manual refill", "Basic coin mechanism"],
    rating: 4.2,
    downloads: 1250,
    image: "/simple-vending-machine-blueprint.jpg",
  },
  {
    id: 2,
    title: "Multi-Product Vending Machine",
    description: "Advanced design with multiple product slots and digital payment",
    difficulty: "Advanced",
    estimatedCost: "$200-400",
    materials: ["Raspberry Pi", "Stepper Motors", "LCD Display", "Payment Module"],
    features: ["Multiple products", "Digital payments", "Inventory tracking"],
    rating: 4.7,
    downloads: 890,
    image: "/advanced-vending-machine-blueprint.jpg",
  },
  {
    id: 3,
    title: "Crypto-Enabled Smart Vendor",
    description: "Blockchain-integrated vending solution with IoT capabilities",
    difficulty: "Expert",
    estimatedCost: "$300-600",
    materials: ["ESP32", "OLED Display", "Crypto Wallet Module", "Sensors"],
    features: ["Cryptocurrency payments", "Smart contracts", "Remote monitoring"],
    rating: 4.9,
    downloads: 456,
    image: "/crypto-smart-vending-machine.jpg",
  },
]

const researchPapers = [
  {
    title: "Automated Retail Systems: A Comprehensive Analysis",
    authors: "Smith, J. et al.",
    journal: "Journal of Retail Technology",
    year: 2023,
    abstract: "This paper examines the evolution of automated retail systems and their impact on consumer behavior...",
    link: "#",
  },
  {
    title: "Blockchain Integration in Vending Machine Networks",
    authors: "Chen, L. & Rodriguez, M.",
    journal: "Distributed Systems Quarterly",
    year: 2023,
    abstract:
      "An exploration of how blockchain technology can enhance vending machine operations through decentralized payment systems...",
    link: "#",
  },
  {
    title: "IoT-Enabled Inventory Management for Automated Vendors",
    authors: "Patel, R. et al.",
    journal: "Internet of Things Review",
    year: 2022,
    abstract:
      "This study presents a novel approach to real-time inventory tracking using IoT sensors and machine learning algorithms...",
    link: "#",
  },
]

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800"
    case "Advanced":
      return "bg-yellow-100 text-yellow-800"
    case "Expert":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function FabricationResearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Fabrication & Research</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore open-source blueprints, research papers, and community contributions for building your own vending
            machines and automated retail solutions.
          </p>
        </div>

        {/* Blueprints Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Community Blueprints</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((blueprint) => (
              <Card key={blueprint.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={blueprint.image || "/placeholder.svg"}
                    alt={blueprint.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${getDifficultyColor(blueprint.difficulty)}`}>
                    {blueprint.difficulty}
                  </Badge>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{blueprint.title}</CardTitle>
                      <CardDescription className="mt-1">{blueprint.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {blueprint.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {blueprint.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {blueprint.estimatedCost}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Materials Needed</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {blueprint.materials.slice(0, 3).map((material, index) => (
                          <li key={index}>• {material}</li>
                        ))}
                        {blueprint.materials.length > 3 && (
                          <li className="text-xs">+ {blueprint.materials.length - 3} more...</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Research Papers Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Research Papers</h2>

          <div className="space-y-6">
            {researchPapers.map((paper, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{paper.title}</CardTitle>
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">{paper.authors}</span> • {paper.journal} • {paper.year}
                      </div>
                      <CardDescription className="text-base">{paper.abstract}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Paper
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Contribute to the Community</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Have you built your own vending machine or conducted research in automated retail? Share your
                blueprints, findings, and innovations with the community.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg">Submit Blueprint</Button>
                <Button size="lg" variant="outline">
                  Share Research
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
