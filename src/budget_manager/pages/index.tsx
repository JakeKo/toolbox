import { Button, CloseButton, Dialog, Group, Space, Text } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStateFromFile } from "../../utils";
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

function deserialize(data: string) {
  const parsed = JSON.parse(data);
  Object.values(parsed).forEach(
    (item: any) => (item.date = new Date(item.date))
  );

  return parsed as Record<string, TransactionRecord>;
}

function BudgetManager() {
  const [records, setRecords, recordsChanged, load, save] = useStateFromFile<
    Record<string, TransactionRecord>
  >({}, "budget_manager/transaction_records.json", { deserialize });

  const sortedRecords = useMemo(
    () => Object.values(records).sort((a, b) => (a.date < b.date ? -1 : 1)),
    [records]
  );

  useEffect(() => void load(), []);

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
          <Button variant="outline" onClick={load}>
            Reset
          </Button>
          <Button onClick={save}>Save</Button>
        </Group>
      </Dialog>
    </div>
  );
}

export default BudgetManager;
