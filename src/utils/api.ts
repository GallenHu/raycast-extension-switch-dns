import { LocalStorage } from "@raycast/api";
import { execSync, ExecSyncOptions } from "node:child_process";
import { LOCAL_STORAGE_KEY, DEFAULT_DNS, EMPTY_DNS } from "../constants/general";
import type { DnsItem } from "./../types/general";

const COMMANDS = {
  GET_DEVICE: () => "/usr/sbin/netstat -rn | awk '/default/{print $NF}' | head -1",
  GET_NETWORK_SERVICE: () =>
    `/usr/sbin/networksetup -listnetworkserviceorder | grep -B 1 $(${COMMANDS.GET_DEVICE()}) | awk -F'\\) ' '{print $2}' | head -1`,
  GET_CURRENT_DNS: (networkService: string) => `/usr/sbin/networksetup -getdnsservers "${networkService}"`,
  SWITCH_DNS: (networkService: string, dns: string) =>
    `/usr/sbin/networksetup -setdnsservers "${networkService}" ${dns}`,
};

export const getStoredDns = async (): Promise<DnsItem[]> => {
  await LocalStorage.clear();

  const serializedDnsList =
    (await LocalStorage.getItem<string>(LOCAL_STORAGE_KEY.DNS_LIST)) || JSON.stringify(DEFAULT_DNS);

  try {
    return JSON.parse(serializedDnsList);
  } catch (err) {
    return [];
  }
};

export const setStoredDns = (list: DnsItem[]) => {
  LocalStorage.setItem(LOCAL_STORAGE_KEY.DNS_LIST, JSON.stringify(list));
};

export const execCmd = async (cmd: string, env: ExecSyncOptions = { shell: "/bin/bash" }) => {
  try {
    const stdout = execSync(cmd, env);
    return {
      data: String(stdout).trim(),
      error: null,
    };
  } catch (err) {
    console.debug((err as Error).message);

    return {
      data: "",
      error: err as Error,
    };
  }
};

export const getCurrentDns = async () => {
  const { data: networkService } = await execCmd(COMMANDS.GET_NETWORK_SERVICE());
  const { data: currentDns, error } = await execCmd(COMMANDS.GET_CURRENT_DNS(networkService));

  if (error) {
    throw error;
  }

  if (currentDns.indexOf("any") !== -1) {
    return { networkService, currentDns: EMPTY_DNS.dns };
  }

  return { currentDns: currentDns.replace("\n", ","), networkService };
};

export const applyDns = async (dns: string) => {
  dns = dns.split(",").join(" ");

  const { networkService } = await getCurrentDns();
  const { error } = await execCmd(COMMANDS.SWITCH_DNS(networkService, dns));

  return { error };
};
