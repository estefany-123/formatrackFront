import { Input } from "@heroui/input";

type InputProps = {
  label: string;
  className?: string;
  placeholder?: string;
  type: string;
  isRequired?: boolean;
  labelPlacement?: "outside" | "outside-left" | "inside";
  name?: string;
  value?: string | (readonly string[] & string) | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  selectedKey?: string;
};
export default function Inpu({
  label,
  placeholder,
  type,
  name,
  isRequired,
  labelPlacement,
  value,
  onChange,
  error,
  selectedKey,
}: InputProps) {
  return (
    <Input
      aria-label={label}
      isRequired={isRequired}
      label={label}
      labelPlacement={labelPlacement}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      className={error ? "border-red-500" : ""}
      {...error && (
        <span className="text-sm text-red-500 mt-1 ml-1">{error}</span>
      )}
      />
  );
}
