"use client"

import { useEffect, useRef } from "react"

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (typeof window !== "undefined" && ref.current) {
        try {
          const mermaid = (await import("mermaid")).default

          mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            themeVariables: {
              primaryColor: "#3b82f6",
              primaryTextColor: "#1f2937",
              primaryBorderColor: "#2563eb",
              lineColor: "#6b7280",
              secondaryColor: "#f3f4f6",
              tertiaryColor: "#ffffff",
            },
          })

          const { svg } = await mermaid.render("mermaid-diagram", chart)
          if (ref.current) {
            ref.current.innerHTML = svg
          }
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
      <div ref={ref} className="flex justify-center items-center min-h-[200px] bg-white rounded-lg border p-4" />
    </div>
  )
}
