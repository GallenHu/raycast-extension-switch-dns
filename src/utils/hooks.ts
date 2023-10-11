import { useEffect, useState } from "react";
import { showHUD, popToRoot } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { getStoredDns, setStoredDns, getCurrentDns, applyDns } from "./api";
import type { DnsItem } from "../types/general";

export const useDnsList = (searchText?: string) => {
  const [loading, setLoading] = useState(false);
  const [dnsList, setDnsList] = useCachedState<DnsItem[]>("DnsList", []);

  const filterDns = (list: DnsItem[], searchText: string) => {
    if (!searchText) return list;
    return list.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.dns.includes(searchText.toLowerCase()) ||
        item.description?.includes(searchText.toLowerCase())
      );
    });
  };

  const add = (record: DnsItem) => {
    const newList = [record, ...dnsList];
    setDnsList(newList);
    setStoredDns(newList);
  };

  const remove = (dnsName: string) => {
    const newList = dnsList.filter((item) => item.name !== dnsName);
    setDnsList(newList);
    setStoredDns(newList);
  };

  useEffect(() => {
    if (!dnsList.length) {
      setLoading(true);
      getStoredDns()
        .then((res) => {
          setDnsList(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return { loading, add, remove, dnsList: searchText ? filterDns(dnsList, searchText) : dnsList };
};

export const useCurrentDns = () => {
  const [loading, setLoading] = useState(false);
  const [dns, setDns] = useCachedState("CurrentDns", "");

  useEffect(() => {
    if (!dns) {
      setLoading(true);
      getCurrentDns()
        .then(({ currentDns }) => {
          setDns(currentDns);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const switchDns = async (dnsRecord: DnsItem) => {
    if (dnsRecord.dns === dns) {
      await showHUD(`Already in use: ${dnsRecord.dns}`);
      popToRoot({ clearSearchBar: false });
      return false;
    }

    const { error } = await applyDns(dnsRecord.dns);

    if (!error) {
      setDns(dnsRecord.dns);
      await showHUD(`${dnsRecord.name} has been applied: ${dnsRecord.dns}`);
      popToRoot({ clearSearchBar: false });
    }
  };

  return { loading, switchDns, currentDns: dns };
};
