"use client"

import { useAccount, useReadContract } from "wagmi"
import { VENDING_MACHINE_ABI } from "@/lib/contracts/vending-machine-abi"
import { CONTRACT_ADDRESSES, ROLES } from "@/lib/contracts/addresses"

export function useRoles() {
  const { address } = useAccount()

  const { data: hasOperatorRole, isLoading: operatorLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VENDING_MACHINE,
    abi: VENDING_MACHINE_ABI,
    functionName: "hasRole",
    args: [ROLES.OPERATOR_ROLE, address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  const { data: hasTreasuryRole, isLoading: treasuryLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VENDING_MACHINE,
    abi: VENDING_MACHINE_ABI,
    functionName: "hasRole",
    args: [ROLES.TREASURY_ROLE, address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  const { data: hasAdminRole, isLoading: adminLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.VENDING_MACHINE,
    abi: VENDING_MACHINE_ABI,
    functionName: "hasRole",
    args: [ROLES.DEFAULT_ADMIN_ROLE, address || "0x0"],
    query: {
      enabled: Boolean(address),
    },
  })

  return {
    hasOperatorRole: Boolean(hasOperatorRole),
    hasTreasuryRole: Boolean(hasTreasuryRole),
    hasAdminRole: Boolean(hasAdminRole),
    isLoading: operatorLoading || treasuryLoading || adminLoading,
    roles: {
      operator: Boolean(hasOperatorRole),
      treasury: Boolean(hasTreasuryRole),
      admin: Boolean(hasAdminRole),
    }
  }
}