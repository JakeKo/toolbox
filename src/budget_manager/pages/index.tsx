import { Button } from "@mantine/core";
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

function BudgetManager() {
  const [transactionRecords, setTransactionRecords] = useState<
    MutableTransactionRecordFormValues[]
  >([]);

  useEffect(() => {
    loadTransactionRecords();
  }, []);

  async function loadTransactionRecords() {
    const json = await readTextFile("budget_manager/transaction_records.json", {
      dir: BaseDirectory.Document,
    });

    setTransactionRecords(JSON.parse(json));
  }

  async function saveTransactionRecords() {
    const json = JSON.stringify(transactionRecords);

    await createDir("budget_manager", {
      dir: BaseDirectory.Document,
      recursive: true,
    });
    await writeTextFile("budget_manager/transaction_records.json", json, {
      dir: BaseDirectory.Document,
    });
  }

  function createTransactionRecord(
    values: MutableTransactionRecordFormValues
  ): void {
    setTransactionRecords([...transactionRecords, values]);
  }

  return (
    <div>
      <h1>Welcome to Budget Manager!</h1>
      <Button onClick={saveTransactionRecords}>Save</Button>
      <Button onClick={loadTransactionRecords}>Refresh</Button>
      <MutableTransactionRecord
        values={initialValues()}
        onSubmit={createTransactionRecord}
      />
      <div className={style.transactionRecords}>
        {transactionRecords.map((r) => (
          <MutableTransactionRecord
            key={Math.random()}
            values={r}
            onSubmit={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;
