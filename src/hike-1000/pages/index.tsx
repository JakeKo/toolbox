const STATES = [
  "Alaska",
  "Alabama",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Mississippi",
  "Missouri",
  "Minnesota",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
].sort();

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

import { Button, NumberInput, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMemo, useState } from "react";
import style from "../index.module.css";

type HikeFormValues = {
  date: Date;
  description: string;
  location: string;
  distance: number;
};

function Hike1000() {
  const [hikeData, setHikeData] = useState<HikeFormValues[]>([]);
  const breakdownByState = useMemo(() => {
    const breakdown: Record<string, number> = {};
    STATES.forEach((state) => (breakdown[state] = 0));
    hikeData.forEach((hike) => (breakdown[hike.location] += hike.distance));

    return breakdown;
  }, [hikeData]);
  const tally = useMemo(
    () =>
      Object.values(breakdownByState).reduce(
        (total, value) => total + Math.min(value, 20),
        0
      ),
    [breakdownByState]
  );
  const percent = tally / 10;

  const form = useForm<HikeFormValues>({
    initialValues: {
      date: new Date(),
      description: "",
      location: "unknown",
      distance: 0,
    },
  });

  function addHike(hike: HikeFormValues): void {
    setHikeData([...hikeData, hike]);
  }

  function stringifyHikeDetails(hike: HikeFormValues) {
    return `${MONTHS[hike.date.getMonth()]} ${hike.date.getDate()} | ${
      hike.location
    }`;
  }

  return (
    <div className={style.hike1000Frame}>
      <div className={style.interfaceFrame}>
        <h1>Hikes</h1>
        <form className={style.hikeForm} onSubmit={form.onSubmit(addHike)}>
          <DatePicker
            className={style.textInput}
            placeholder="Date"
            required
            clearButtonTabIndex={-1}
            {...form.getInputProps("date")}
          />
          <TextInput
            className={style.textInput}
            placeholder="Description"
            required
            {...form.getInputProps("description")}
          />
          <Select
            searchable
            required
            selectOnBlur
            data={STATES}
            {...form.getInputProps("location")}
          />
          <NumberInput
            min={0}
            required
            precision={1}
            hideControls
            {...form.getInputProps("distance")}
          />
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </form>
        <div className={style.hikeList}>
          {hikeData.map((hike) => (
            <div className={style.card} key={hike.description}>
              <div className={style.cardNumber}>{hike.distance}</div>
              <div className={style.cardDetails}>
                {stringifyHikeDetails(hike)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style.mapFrame}>
        <div className={style.progressBar} style={{ width: `${percent}%` }} />
        <div className={style.map}></div>
      </div>
    </div>
  );
}

export default Hike1000;
