import { Button, NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import style from "../index.module.css";

export interface FormValues {
  item: string;
  vendor: string;
  date: Date;
  category: string;
  amount: number;
}

type PropTypes = {
  onSubmit: (values: FormValues) => void;
};
function TransactionRecordForm({ onSubmit }: PropTypes) {
  const form = useForm<FormValues>({
    initialValues: {
      item: "",
      vendor: "",
      date: new Date(),
      category: "unknown",
      amount: 0,
    },
  });

  return (
    <form className={style.recordingForm} onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Item"
        placeholder="Dinner"
        {...form.getInputProps("item")}
      />
      <TextInput
        label="Vendor"
        placeholder="Raising Canes"
        {...form.getInputProps("vendor")}
      />
      <DatePicker
        placeholder="Pick date"
        label="Date"
        {...form.getInputProps("date")}
      />
      <Select
        label="Category"
        placeholder="Dining"
        searchable
        data={[
          { value: "dining", label: "Dining" },
          { value: "housing_utilities", label: "Housing & Utilities" },
        ]}
        {...form.getInputProps("category")}
      />
      <NumberInput
        placeholder="10"
        label="Amount"
        min={0}
        {...form.getInputProps("amount")}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

export default TransactionRecordForm;
