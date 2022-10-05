import { Button, CloseButton, Dialog, Group, Space, Text } from "@mantine/core";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import MutableTransactionRecord, {
  MutableTransactionRecordFormValues,
} from "../components/mutable_transaction_record";
import style from "../index.module.css";

type TransactionRecord = MutableTransactionRecordFormValues & {
  id: string;
};

function initialValues(): MutableTransactionRecordFormValues {
  return {
    item: "",
    vendor: "",
    date: new Date(),
    category: "unknown",
    amount: 0,
  };
}

function serializeRecords(data: Record<string, TransactionRecord>) {
  return JSON.stringify(data);
}

function deserializeRecords(data: string) {
  const parsed = JSON.parse(data);
  Object.values(parsed).forEach(
    (item: any) => (item.date = new Date(item.date))
  );

  return parsed as Record<string, TransactionRecord>;
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
    Record<string, TransactionRecord>
  >({});
  const sortedRecords = useMemo(
    () => Object.values(records).sort((a, b) => (a.date < b.date ? -1 : 1)),
    [records]
  );

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
    const id = uuidv4();
    const transactionRecord: TransactionRecord = { ...values, id };
    setRecords({ ...records, [id]: transactionRecord });
  }

  function updateRecord(id: string) {
    return (values: MutableTransactionRecordFormValues): void => {
      setRecords({ ...records, [id]: { id, ...values } });
    };
  }

  function deleteRecord(id: string) {
    const { [id]: _, ...newRecords } = records;
    setRecords(newRecords);
  }

  return (
    <div className={style.body}>
      <h1>Welcome to Budget Manager!</h1>
      <MutableTransactionRecord
        values={initialValues()}
        onSubmit={createRecord}
        isMainInput
      />
      <Space h="md" />
      <div className={style.transactionRecords}>
        {sortedRecords.map((r) => (
          <div className={style.recordListItem}>
            <CloseButton
              className={style.recordDeleteButton}
              onClick={() => deleteRecord(r.id)}
            />
            <MutableTransactionRecord
              key={Math.random()}
              values={r}
              onSubmit={updateRecord(r.id)}
            />
          </div>
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
