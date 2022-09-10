import style from "../index.module.css";
import { FormValues } from "./transaction_record_form";

type PropTypes = { record: FormValues };
function TransactionRecord({ record }: PropTypes) {
  return (
    <div className={style.transactionRecord}>{JSON.stringify(record)}</div>
  );
}

export default TransactionRecord;
