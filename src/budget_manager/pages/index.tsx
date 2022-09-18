import { Button } from "@mantine/core";
import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import TransactionRecord from "../components/transaction_record";
import TransactionRecordForm, {
  FormValues,
} from "../components/transaction_record_form";
import style from "../index.module.css";

function BudgetManager() {
  const [transactionRecords, setTransactionRecords] = useState<FormValues[]>(
    []
  );

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

  function createTransactionRecord(values: FormValues): void {
    setTransactionRecords([...transactionRecords, values]);
  }

  return (
    <div>
      <h1>Welcome to Budget Manager!</h1>
      <Button onClick={saveTransactionRecords}>Save</Button>
      <Button onClick={loadTransactionRecords}>Refresh</Button>
      <TransactionRecordForm onSubmit={createTransactionRecord} />
      <div className={style.transactionRecords}>
        {transactionRecords.map((r) => (
          <TransactionRecord key={Math.random()} record={r} />
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;
