"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidDiagramProps {
  chart: string
  title?: string
  className?: string
}

export function MermaidDiagram({ chart, title, className = "" }: MermaidDiagramProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!elementRef.current) return

      try {
        setIsLoading(true)
        setError(null)

        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "inherit",
        })

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg } = await mermaid.render(id, chart)

        if (elementRef.current) {
          elementRef.current.innerHTML = svg
        }
      } catch (err) {
        console.error("Error rendering Mermaid diagram:", err)
        setError(err instanceof Error ? err.message : "Failed to render diagram")
      } finally {
        setIsLoading(false)
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className={`p-4 border border-red-200 rounded-lg bg-red-50 ${className}`}>
        <h3 className="text-red-800 font-medium">Diagram Error</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className={`mermaid-container ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div
        ref={elementRef}
        className="mermaid-diagram flex justify-center"
        style={{ minHeight: isLoading ? "200px" : "auto" }}
      />
    </div>
  )
}

// Default export for compatibility
export default MermaidDiagram
