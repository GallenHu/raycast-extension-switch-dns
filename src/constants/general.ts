export const LOCAL_STORAGE_KEY = {
  DNS_LIST: "DNS_LIST",
};

export const GOOGLE_DNS = { name: "Google", dns: "8.8.8.8,8.8.4.4", description: "Google Public DNS" };
export const OPEN_DNS = { name: "OpenDNS", dns: "208.67.222.222,208.67.220.220", description: "Public DNS by OpenDNS" };
export const CLOUDFLARE_DNS = { name: "Cloudflare", dns: "1.1.1.1,1.0.0.1", description: "Cloudflare Public DNS" };
export const ALIBABA_DNS = { name: "Alibaba", dns: "223.5.5.5,223.6.6.6", description: "Alibaba Cloud Public DNS" };
export const EMPTY_DNS = { name: "Empty DNS", dns: "Empty", description: "Empty DNS" };

export const DEFAULT_DNS = [GOOGLE_DNS, OPEN_DNS, CLOUDFLARE_DNS, ALIBABA_DNS, EMPTY_DNS];
