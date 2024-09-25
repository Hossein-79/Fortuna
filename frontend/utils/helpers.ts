import { Network } from "@aptos-labs/ts-sdk";
import { NetworkInfo, isAptosNetwork } from "@aptos-labs/wallet-adapter-react";

export const isValidNetworkName = (network: NetworkInfo | null) => {
  if (isAptosNetwork(network)) {
    return Object.values<string | undefined>(Network).includes(network?.name);
  }
  // If the configured network is not an Aptos network, i.e is a custom network
  // we resolve it as a valid network name
  return true;
};

export const convertTimestampToReadable = (timestamp: number) => {
  // CONVERT TIMESTAMP(2024-11-12 21:42:23) TO HUMAN READABLE DATE E.G. 5D 13H / 12H / 3M 11D 5H
  const currentDate = new Date();
  const deadline = new Date(timestamp);
  const diff = deadline.getTime() - currentDate.getTime();

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (months > 0) {
    return `${months}M ${days}D ${hours}H`;
  } else if (days > 0) {
    return `${days}D ${hours}H`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
}

export const calculatePercentage = (total: number, goal: number) => {
  return Math.round((total / goal) * 100);
}
