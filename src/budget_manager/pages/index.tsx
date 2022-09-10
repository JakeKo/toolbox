import { useState } from "react";
import TransactionRecord from "../components/transaction_record";
import TransactionRecordForm, {
  FormValues,
} from "../components/transaction_record_form";
import style from "../index.module.css";

function BudgetManager() {
  const [transactionRecords, setTransactionRecords] = useState<FormValues[]>(
    []
  );

  function createTransactionRecord(values: FormValues): void {
    setTransactionRecords([...transactionRecords, values]);
  }

  return (
    <div>
      <h1>Welcome to Budget Manager!</h1>
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
