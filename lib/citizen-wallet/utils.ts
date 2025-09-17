import { generateReceiveLink, CommunityConfig } from "@citizenwallet/sdk"
import { BREAD_COMMUNITY_CONFIG } from "./config"

export function generateBreadReceiveLink(
  sigAuthRedirect: string,
  toAccountAddress: string,
  amount: string,
  description?: string,
  successRedirect?: string,
): string {
  const config = new CommunityConfig(BREAD_COMMUNITY_CONFIG)

  let receiveLink = generateReceiveLink(sigAuthRedirect, config, toAccountAddress, amount, description)

  if (successRedirect) {
    receiveLink += `&success=${encodeURIComponent(successRedirect)}`
  }

  return receiveLink
}

export function createPaymentLink(
  amount: string,
  description: string,
  recipientAddress = "0x6b3a1f4277391526413F583c23D5B9EF4d2fE986", // Default to community profile address
): string {
  // For now, we'll create a simple payment link
  // In a real implementation, you'd get the sigAuthRedirect from query parameters
  const sigAuthRedirect = typeof window !== "undefined" ? window.location.origin : ""
  const successRedirect =
    typeof window !== "undefined" ? `${window.location.origin}/vending-machine?payment=success` : ""

  return generateBreadReceiveLink(sigAuthRedirect, recipientAddress, amount, description, successRedirect)
}
