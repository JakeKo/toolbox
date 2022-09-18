import { NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import style from "../index.module.css";

export interface MutableTransactionRecordFormValues {
  item: string;
  vendor: string;
  date: Date;
  category: string;
  amount: number;
}

type PropTypes = {
  values: MutableTransactionRecordFormValues;
  onSubmit: (value: MutableTransactionRecordFormValues) => void;
};
function MutableTransactionRecord({ values, onSubmit }: PropTypes) {
  const form = useForm<MutableTransactionRecordFormValues>({
    initialValues: values,
  });

  return (
    <form
      className={style.mutableTransactionRecord}
      onSubmit={form.onSubmit(onSubmit)}
    >
      <TextInput
        className={style.textInput}
        placeholder="Dinner"
        required
        {...form.getInputProps("item")}
      />
      <TextInput
        placeholder="Raising Canes"
        required
        {...form.getInputProps("vendor")}
      />
      <DatePicker
        placeholder="Pick date"
        required
        clearButtonTabIndex={-1}
        {...form.getInputProps("date")}
      />
      <Select
        placeholder="Dining"
        searchable
        required
        data={[
          { value: "dining", label: "Dining" },
          { value: "housing_utilities", label: "Housing & Utilities" },
        ]}
        {...form.getInputProps("category")}
      />
      <NumberInput
        placeholder="10"
        min={0}
        required
        {...form.getInputProps("amount")}
      />
    </form>
  );
}

export default MutableTransactionRecord;
