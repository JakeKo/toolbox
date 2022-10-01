import { Button, Dialog, Group, Space, Text } from "@mantine/core";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import MutableTransactionRecord, {
  MutableTransactionRecordFormValues,
} from "../components/mutable_transaction_record";
import style from "../index.module.css";

function initialValues(): MutableTransactionRecordFormValues {
  return {
    item: "",
    vendor: "",
    date: new Date(),
    category: "unknown",
    amount: 0,
  };
}

function serializeRecords(data: MutableTransactionRecordFormValues[]) {
  return JSON.stringify(data);
}

function deserializeRecords(data: string) {
  const parsed = JSON.parse(data);
  parsed.forEach((item: any) => (item.date = new Date(item.date)));

  return parsed as MutableTransactionRecordFormValues[];
}

/** Works like useState with a boolean determining if state was updated */
function useTrackedState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  const [changed, setChanged] = useState(false);

  function setTrackedState(newState: T, newChanged: boolean = true) {
    setState(newState);
    setChanged(newChanged);
  }

  return [state, setTrackedState, changed] as [
    T,
    typeof setTrackedState,
    boolean
  ];
}

function BudgetManager() {
  const [records, setRecords, recordsChanged] = useTrackedState<
    MutableTransactionRecordFormValues[]
  >([]);

  useEffect(() => {
    loadRecords();
  }, []);

  async function loadRecords() {
    const json = await readTextFile("budget_manager/transaction_records.json", {
      dir: BaseDirectory.Document,
    });

    const records = deserializeRecords(json);
    setRecords(records, false);
  }

  async function saveRecords() {
    const json = serializeRecords(records);

    await createDir("budget_manager", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
    await writeTextFile("budget_manager/transaction_records.json", json, {
      dir: BaseDirectory.Document,
    });
    setRecords(records, false);
  }

  function createRecord(values: MutableTransactionRecordFormValues): void {
    setRecords([...records, values]);
  }

  return (
    <div className={style.body}>
      <h1>Welcome to Budget Manager!</h1>
      <MutableTransactionRecord
        values={initialValues()}
        onSubmit={createRecord}
        resetOnSubmit={true}
      />
      <Space h="md" />
      <div className={style.transactionRecords}>
        {records.map((r) => (
          <MutableTransactionRecord
            key={Math.random()}
            values={r}
            onSubmit={(values) => console.log(values)}
          />
        ))}
      </div>
      <Dialog opened={recordsChanged} size="md" radius="md">
        <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
          You've made changes
        </Text>

        <Group>
          <Button variant="outline" onClick={loadRecords}>
            Reset
          </Button>
          <Button onClick={saveRecords}>Save</Button>
        </Group>
      </Dialog>
    </div>
  );
}

export default BudgetManager;
