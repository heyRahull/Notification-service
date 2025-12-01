// src/components/common/TextInput.jsx
export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium mb-1">
        {label} {required && "*"}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
