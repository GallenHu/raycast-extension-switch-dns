import { Action, ActionPanel, Color, Icon, Keyboard, List } from "@raycast/api";
import DnsEdit from "./DnsEdit";
import { useCurrentDns, useDnsList } from "../utils/hooks";
import { EMPTY_DNS } from "../constants/general";
import type { DnsItem } from "../types/general";

interface Props {
  data: DnsItem;
}

export default function DnsList({ data }: Props) {
  const { currentDns, switchDns } = useCurrentDns();
  const { remove } = useDnsList();

  const SHORTCUTS: Record<string, Keyboard.Shortcut> = {
    ADD: { modifiers: ["cmd"], key: "n" },
    DELETE: { modifiers: ["cmd"], key: "backspace" },
  };

  const isCurrent = data.dns === currentDns;
  const isEmptyDns = data.dns === EMPTY_DNS.dns;

  return (
    <List.Item
      icon={{ source: isCurrent ? Icon.Checkmark : Icon.Circle, tintColor: isCurrent ? Color.Green : Color.SecondaryText }}
      title={data.name}
      subtitle={data.dns}
      accessories={[{ text: data.description }]}
      actions={
        <ActionPanel>
          <Action title="Apply" icon={Icon.Checkmark} onAction={() => switchDns(data)} />
          <Action.Push title="Add" icon={Icon.PlusCircle} shortcut={SHORTCUTS.ADD} target={<DnsEdit />} />
          {!isEmptyDns && (
            <Action title="Delete" icon={Icon.MinusCircle} shortcut={SHORTCUTS.DELETE} onAction={() => remove(data.name)} />
          )}
        </ActionPanel>
      }
    />
  );
}
