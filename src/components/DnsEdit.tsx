import { Action, ActionPanel, Form, useNavigation, Icon } from "@raycast/api";
import { useState } from "react";
import { useDnsList } from "../utils/hooks";
import type { DnsItem } from "../types/general";

export default function DnsEdit() {
  const [nameError, setNameError] = useState<string | undefined>();
  const [dnsError, setDnsError] = useState<string | undefined>();
  const { pop } = useNavigation();
  const { add, dnsList } = useDnsList();

  const validateName = (event: Form.Event<string>) => {
    const value = event.target.value?.trim();
    if (value?.length) {
      if (dnsList.find(item => item.name.toLowerCase() === value.toLowerCase())) {
        setNameError("Name is already in use!");
      } else {
        setNameError(undefined);
      }

    } else {
      setNameError("The field should't be empty!");
    }
  };

  const validateDns = (event: Form.Event<string>) => {
    const value = event.target.value;
    if (value?.length) {
      const parts = value.replaceAll(",", "\n").replaceAll(" ", "\n").split("\n");
      const valid = parts.every((str) => /^(\d{1,3}\.){3}\d{1,3}$/.test(str));

      if (valid) {
        setDnsError(undefined);
      } else {
        setDnsError("Invalid input!");
      }
    } else {
      setDnsError("The field should't be empty!");
    }
  };

  const onSubmit = (values: DnsItem) => {
    const dns = values.dns.replaceAll(" ", ",").split("\n").join(",");

    add({...values, dns});

    pop();
  };

  return (
    <Form
      actions={
        <ActionPanel title="Add Custom DNS">
          <Action.SubmitForm title="Add" icon={Icon.Plus} onSubmit={onSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" id="name" placeholder="Name Your DNS" error={nameError} onBlur={validateName} />
      <Form.TextArea title="DNS" id="dns" placeholder={`8.8.8.8\n8.8.4.4\n`} error={dnsError} onBlur={validateDns} />
      <Form.TextArea title="Description" id="description" placeholder="Description (optional)" />
    </Form>
  );
}
