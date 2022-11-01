import { NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useFocusWithin } from "@mantine/hooks";
import { useRef } from "react";
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
  onSubmit: (values: MutableTransactionRecordFormValues) => void;
  isMainInput?: boolean;
};
function MutableTransactionRecord({
  values,
  onSubmit,
  isMainInput = false,
}: PropTypes) {
  const form = useForm<MutableTransactionRecordFormValues>({
    initialValues: values,
    validate: isMainInput
      ? {}
      : {
          item: (value) => (value === "" ? "Item is required" : null),
          vendor: (value) => (value === "" ? "Vendor is required" : null),
          category: (value) =>
            value === "unknown" ? "Category is required" : null,
          amount: (value) => (value <= 0 ? "Value is required" : null),
        },
  });

  const handleSubmit = form.onSubmit(
    (values: MutableTransactionRecordFormValues) => {
      if (form.isValid() && form.isDirty()) {
        onSubmit(values);

        if (isMainInput) {
          form.reset();
          setTimeout(() => firstInputRef.current?.focus(), 0);
        }
      }
    }
  );

  const { ref: focusRef } = useFocusWithin({
    onBlur: handleSubmit as () => void,
  });
  const firstInputRef = useRef<HTMLElement>();

  return (
    <form
      className={style.mutableTransactionRecord}
      onSubmit={handleSubmit}
      ref={focusRef}
    >
      <DatePicker
        ref={firstInputRef}
        placeholder="Date"
        required
        clearButtonTabIndex={-1}
        {...form.getInputProps("date")}
      />
      <TextInput
        className={style.textInput}
        placeholder="Item"
        required
        {...form.getInputProps("item")}
      />
      <TextInput
        placeholder="Vendor"
        required
        {...form.getInputProps("vendor")}
      />
      <Select
        searchable
        required
        selectOnBlur
        data={[
          { value: "dining", label: "Dining" },
          { value: "housing_utilities", label: "Housing & Utilities" },
        ]}
        {...form.getInputProps("category")}
      />
      <NumberInput
        min={0}
        required
        precision={2}
        hideControls
        type="number"
        {...form.getInputProps("amount")}
      />
    </form>
  );
}

export default MutableTransactionRecord;
