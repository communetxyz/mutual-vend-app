"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteNavigation } from "@/components/site-navigation"
import { useVendingMachine } from "@/hooks/use-vending-machine"
import { 
  Printer, 
  Cog, 
  Cpu, 
  Wifi, 
  DollarSign, 
  Package, 
  ExternalLink,
  Download,
  Github,
  BookOpen,
  Zap
} from "lucide-react"
import Link from "next/link"

// Mock hardware specs - in production this would come from actual hardware documentation
const HARDWARE_SPECS = {
  dimensions: { width: 60, height: 180, depth: 80 }, // cm
  weight: 45, // kg
  power: 150, // watts
  capacity: 8, // tracks
  maxItemsPerTrack: 10,
  connectivity: ["WiFi", "Ethernet", "4G LTE"],
  payment: ["Crypto wallets", "NFC", "QR codes"],
  sensors: ["Weight sensors", "Dispense confirmation", "Temperature monitoring"]
}

export default function FabricationResearchPage() {
  const { tracks, loading } = useVendingMachine()

  const totalCapacity = HARDWARE_SPECS.capacity * HARDWARE_SPECS.maxItemsPerTrack
  const currentStock = tracks.reduce((sum, track) => sum + Number(track.stock), 0)
  const utilization = totalCapacity > 0 ? (currentStock / totalCapacity) * 100 : 0

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SiteNavigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Open-Source Vending Hardware
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                3D-printable, modular, and fully open-source vending machine designs for the decentralized economy
              </p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Badge variant="outline">Open Source</Badge>
                <Badge variant="outline">3D Printable</Badge>
                <Badge variant="outline">Modular Design</Badge>
                <Badge variant="outline">Crypto-Native</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Current Hardware Status */}
        <section className="w-full py-12 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Current Hardware Status</h2>
              <p className="text-gray-500 dark:text-gray-400">Live data from deployed machines</p>
            </div>
            
            {loading ? (
              <div className="text-center">
                <p className="text-gray-500">Loading hardware status...</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{tracks.length}</p>
                        <p className="text-sm text-gray-500">Active Tracks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Cog className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{currentStock}</p>
                        <p className="text-sm text-gray-500">Items Loaded</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{utilization.toFixed(0)}%</p>
                        <p className="text-sm text-gray-500">Capacity Used</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">Online</p>
                        <p className="text-sm text-gray-500">Network Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        {/* Hardware Details */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="design">Design Files</TabsTrigger>
                <TabsTrigger value="assembly">Assembly</TabsTrigger>
                <TabsTrigger value="software">Software</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-8">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cog className="h-5 w-5" />
                        Physical Specifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{HARDWARE_SPECS.dimensions.height}</p>
                          <p className="text-sm text-gray-500">Height (cm)</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{HARDWARE_SPECS.dimensions.width}</p>
                          <p className="text-sm text-gray-500">Width (cm)</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{HARDWARE_SPECS.dimensions.depth}</p>
                          <p className="text-sm text-gray-500">Depth (cm)</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{HARDWARE_SPECS.weight}</p>
                          <p className="text-sm text-gray-500">Weight (kg)</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{HARDWARE_SPECS.power}</p>
                          <p className="text-sm text-gray-500">Power (W)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Cpu className="h-5 w-5" />
                        Technical Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Capacity</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>Tracks: {HARDWARE_SPECS.capacity}</div>
                          <div>Items per track: {HARDWARE_SPECS.maxItemsPerTrack}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Connectivity</h4>
                        <div className="flex flex-wrap gap-1">
                          {HARDWARE_SPECS.connectivity.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">{type}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Payment Methods</h4>
                        <div className="flex flex-wrap gap-1">
                          {HARDWARE_SPECS.payment.map((method) => (
                            <Badge key={method} variant="secondary" className="text-xs">{method}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Sensors</h4>
                        <div className="flex flex-wrap gap-1">
                          {HARDWARE_SPECS.sensors.map((sensor) => (
                            <Badge key={sensor} variant="secondary" className="text-xs">{sensor}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Printer className="h-5 w-5" />
                        3D Printable Components
                      </CardTitle>
                      <CardDescription>STL files for all structural components</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Main chassis</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Track modules (8x)</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Dispense mechanisms</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Control panel housing</span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download Complete Design Package
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Bill of Materials</CardTitle>
                      <CardDescription>Electronic components and hardware needed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Raspberry Pi 4 (8GB)</span>
                          <span className="text-sm font-mono">$75</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Servo motors (8x)</span>
                          <span className="text-sm font-mono">$120</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Weight sensors (8x)</span>
                          <span className="text-sm font-mono">$80</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">7" touchscreen</span>
                          <span className="text-sm font-mono">$65</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Miscellaneous hardware</span>
                          <span className="text-sm font-mono">$160</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between font-medium">
                          <span>Total Cost</span>
                          <span className="font-mono">~$500</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Excludes 3D printing materials (~$50)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="assembly" className="mt-8">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Assembly Guide</CardTitle>
                      <CardDescription>Step-by-step instructions for building your vending machine</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { step: 1, title: "Print Components", desc: "3D print all structural components using PLA+ or PETG" },
                          { step: 2, title: "Assemble Frame", desc: "Connect chassis parts and install track modules" },
                          { step: 3, title: "Install Electronics", desc: "Mount Raspberry Pi, sensors, and servo motors" },
                          { step: 4, title: "Wire Connections", desc: "Connect all electronic components according to wiring diagram" },
                          { step: 5, title: "Software Setup", desc: "Flash SD card with Mutual Vend OS and configure network" },
                          { step: 6, title: "Calibration", desc: "Test all tracks and calibrate dispensing mechanisms" },
                        ].map((item) => (
                          <div key={item.step} className="flex gap-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-6 border-t">
                        <div className="flex gap-4">
                          <Button variant="outline">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Full Assembly Guide
                          </Button>
                          <Button variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Video Tutorial
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="software" className="mt-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        Open Source Software
                      </CardTitle>
                      <CardDescription>All software components are open source and customizable</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">Mutual Vend OS</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Custom Linux distribution based on Raspberry Pi OS
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Github className="h-3 w-3 mr-1" />
                            View on GitHub
                          </Button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Web3 Integration</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Ethereum/Polygon blockchain integration with smart contracts
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Github className="h-3 w-3 mr-1" />
                            Smart Contracts
                          </Button>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Hardware Drivers</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Python drivers for sensors, motors, and payment systems
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Github className="h-3 w-3 mr-1" />
                            Hardware Repo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Development Roadmap</CardTitle>
                      <CardDescription>Planned features and improvements</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Multi-chain support</span>
                          <Badge variant="secondary">Q2 2025</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">AI inventory optimization</span>
                          <Badge variant="secondary">Q3 2025</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Mobile app integration</span>
                          <Badge variant="secondary">Q3 2025</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Modular track system</span>
                          <Badge variant="secondary">Q4 2025</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Solar power option</span>
                          <Badge variant="secondary">Q1 2026</Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Want to contribute? Join our developer community!
                        </p>
                        <Button size="sm" className="mt-2">
                          <Github className="h-3 w-3 mr-1" />
                          Contribute
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Community & Support */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Build Your Own Machine</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join the growing community of builders creating decentralized vending infrastructure
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <Download className="h-5 w-5 mr-2" />
                Download Plans
              </Button>
              <Button variant="outline" size="lg">
                <Github className="h-5 w-5 mr-2" />
                View Source Code
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}