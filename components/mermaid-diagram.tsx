"use client"

import { useEffect, useRef, type FC } from "react"
import mermaid from "mermaid"

type MermaidProps = {
  chart: string
}

// Simple wrapper to render a Mermaid diagram on the client
const MermaidDiagram: FC<MermaidProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current) return

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: "basis",
          },
        })

        // Clear previous content
        elementRef.current.innerHTML = chart

        await mermaid.run({
          nodes: [elementRef.current],
        })
      } catch (error) {
        console.error("Failed to render Mermaid diagram:", error)
        // Fallback to showing the raw chart text
        if (elementRef.current) {
          elementRef.current.innerHTML = `<pre style="text-align: left; font-size: 12px; color: #666;">${chart}</pre>`
        }
      }
    }
    renderDiagram()
  }, [chart])

  return (
    <div className="flex justify-center items-center w-full">
      <div ref={elementRef} className="mermaid w-full" />
    </div>
  )
}

export default MermaidDiagram
