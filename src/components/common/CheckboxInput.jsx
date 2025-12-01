export default function CheckboxInput({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        name={id}
        checked={checked}
        onChange={onChange}
        className="mr-2 cursor-pointer"
      />
      <label htmlFor={id} className="font-medium cursor-pointer">{label}</label>
    </div>
  );
}
