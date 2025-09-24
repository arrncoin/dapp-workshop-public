// src/lib/ipfs.ts
export function resolveIpfsUrl(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    return uri.replace(
      "ipfs://",
      "https://red-military-crocodile-811.mypinata.cloud/ipfs/"
    );
  }
  return uri;
}
