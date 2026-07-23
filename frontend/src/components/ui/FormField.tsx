import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
};

function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: FormFieldProps) {
  return (
    <label className={className}>
      {label}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
    </label>
  );
}

export default FormField;
