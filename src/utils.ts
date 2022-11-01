import {
  BaseDirectory,
  createDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import path from "path";
import { useState } from "react";

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

type StateFromFileOptions<T> = {
  deserialize?: (state: string) => T;
  serialize?: (state: T) => string;
};

type StateFromFile<T> = [
  state: T,
  setState: (newState: T, newChanged?: boolean) => void,
  changed: boolean,
  load: () => void,
  save: () => void
];

function useStateFromFile<T>(
  initialState: T,
  filePath: string,
  { deserialize, serialize }: StateFromFileOptions<T> = {}
): StateFromFile<T> {
  deserialize ??= JSON.parse;
  serialize ??= JSON.stringify;

  const [state, setState, changed] = useTrackedState<T>(initialState);

  async function load() {
    const json = await readTextFile(filePath, {
      dir: BaseDirectory.Document,
    });

    const newState = deserialize!(json);
    setState(newState, false);
  }

  async function save() {
    const json = serialize!(state);
    const parentDir = path.dirname(filePath);

    await createDir(parentDir, {
      dir: BaseDirectory.Document,
      recursive: true,
    });
    await writeTextFile(filePath, json, { dir: BaseDirectory.Document });

    setState(state, false);
  }

  return [state, setState, changed, load, save];
}

export { useTrackedState, useStateFromFile };
