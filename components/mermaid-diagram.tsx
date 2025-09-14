"use client"

import { useEffect, type FC } from "react"
import mermaid from "mermaid"

type MermaidProps = {
  chart: string
}

// Simple wrapper to render a Mermaid diagram on the client
const MermaidDiagram: FC<MermaidProps> = ({ chart }) => {
  useEffect(() => {
    const renderDiagram = async () => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
        })
        await mermaid.run()
      } catch (error) {
        console.error("Failed to render Mermaid diagram:", error)
      }
    }
    renderDiagram()
  }, [chart])

  return (
    <div key={chart} className="mermaid flex justify-center items-center">
      {chart}
    </div>
  )
}

export default MermaidDiagram
