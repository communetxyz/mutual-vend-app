"use client"

import { useEffect, useRef } from "react"

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export default function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (typeof window !== "undefined" && ref.current) {
        try {
          const mermaid = (await import("mermaid")).default
          mermaid.initialize({
            startOnLoad: true,
            theme: "default",
            securityLevel: "loose",
          })

          ref.current.innerHTML = chart
          await mermaid.run({
            nodes: [ref.current],
          })
        } catch (error) {
          console.error("Error rendering Mermaid diagram:", error)
          if (ref.current) {
            ref.current.innerHTML = `<p class="text-red-500">Error rendering diagram</p>`
          }
        }
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <div ref={ref} className="flex justify-center" />
    </div>
  )
}
