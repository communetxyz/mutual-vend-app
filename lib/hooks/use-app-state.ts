"use client"

import { useState, useCallback } from "react"
import type { AppState, TransactionStatus } from "@/lib/types"

export function useAppState() {
  const [appState, setAppState] = useState<AppState>({
    currentView: "disconnected",
    selectedTrackId: null,
    lastError: null,
    sessionTransactions: [],
  })

  const updateView = useCallback((view: AppState["currentView"]) => {
    setAppState((prev) => ({ ...prev, currentView: view }))
  }, [])

  const selectTrack = useCallback((trackId: number | null) => {
    setAppState((prev) => ({
      ...prev,
      selectedTrackId: trackId,
      currentView: trackId ? "product-selected" : "browsing",
    }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setAppState((prev) => ({ ...prev, lastError: error }))
  }, [])

  const addTransaction = useCallback((transaction: TransactionStatus) => {
    setAppState((prev) => ({
      ...prev,
      sessionTransactions: [transaction, ...prev.sessionTransactions].slice(0, 50), // Keep last 50
    }))
  }, [])

  const updateTransaction = useCallback((hash: string, updates: Partial<TransactionStatus>) => {
    setAppState((prev) => ({
      ...prev,
      sessionTransactions: prev.sessionTransactions.map((tx) => (tx.hash === hash ? { ...tx, ...updates } : tx)),
    }))
  }, [])

  const clearError = useCallback(() => {
    setAppState((prev) => ({ ...prev, lastError: null }))
  }, [])

  const reset = useCallback(() => {
    setAppState({
      currentView: "disconnected",
      selectedTrackId: null,
      lastError: null,
      sessionTransactions: [],
    })
  }, [])

  return {
    appState,
    updateView,
    selectTrack,
    setError,
    addTransaction,
    updateTransaction,
    clearError,
    reset,
  }
}
