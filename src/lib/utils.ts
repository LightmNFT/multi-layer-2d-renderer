import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIpfs(link: string) {
  return link.startsWith("ipfs://");
}

export function getCIDFromIpfsLink(link: string) {
  return link.replace("ipfs://", "");
}

/**
 * @desc refer https://docs.ipfs.tech/concepts/ipfs-gateway/#subdomain
 */
export function getLinkWithGateway(
  cidAndPath: string,
  gateway = "ipfs.io",
  isSubdomain = false
) {
  const firstSeperatorIdx = cidAndPath.indexOf("/");
  const cid = cidAndPath.slice(0, firstSeperatorIdx);
  const path =
    firstSeperatorIdx > -1 ? cidAndPath.slice(firstSeperatorIdx) : "";

  return isSubdomain
    ? `https://${cid}.ipfs.${gateway}${path}`
    : `https://${gateway}/ipfs/${cidAndPath}`;
}

export function convertIpfs(ipfsLike: string, gateway?: string) {
  return isIpfs(ipfsLike)
    ? getLinkWithGateway(getCIDFromIpfsLink(ipfsLike), gateway)
    : ipfsLike;
}
