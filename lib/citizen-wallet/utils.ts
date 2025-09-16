import { generateReceiveLink } from "@citizenwallet/sdk"
import { BREAD_COMMUNITY_CONFIG } from "./config"

export function generateBreadReceiveLink(
  sigAuthRedirect: string,
  toAccountAddress: string,
  amount: string,
  description?: string,
  successRedirect?: string,
): string {
  const receiveLink = generateReceiveLink(
    sigAuthRedirect,
    BREAD_COMMUNITY_CONFIG,
    toAccountAddress,
    amount,
    description,
  )

  if (successRedirect) {
    return `${receiveLink}&success=${encodeURIComponent(successRedirect)}`
  }

  return receiveLink
}

export function isCitizenWalletAvailable(): boolean {
  if (typeof window === "undefined") return false

  // Check if we're in a Citizen Wallet context
  const userAgent = window.navigator.userAgent
  return userAgent.includes("CitizenWallet") || window.location.search.includes("sigAuthRedirect")
}

export function getSigAuthRedirect(): string | null {
  if (typeof window === "undefined") return null

  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("sigAuthRedirect")
}
