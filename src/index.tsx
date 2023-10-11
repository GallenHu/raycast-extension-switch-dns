import { List } from "@raycast/api";
import { useState } from "react";
import DnsList from "./components/DnsList";
import { useDnsList } from "./utils/hooks";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const { loading, dnsList } = useDnsList(searchText);

  return (
    <List searchBarPlaceholder="Search keywords" onSearchTextChange={setSearchText} isLoading={loading}>
      {dnsList.map((item) => (
        <DnsList data={item} key={item.name} />
      ))}
    </List>
  );
}
