import style from "../index.module.css";

function BudgetManager() {
  return (
    <div>
      <h1>Welcome to Budget Manager!</h1>

      <form className={style.recordingForm}>
        <input type="text" />
        <input type="text" />
        <input type="date" />
        <select defaultValue="unknown">
          <option hidden disabled value="unknown">
            Category...
          </option>
        </select>
        <input type="number" />
      </form>
    </div>
  );
}

export default BudgetManager;
