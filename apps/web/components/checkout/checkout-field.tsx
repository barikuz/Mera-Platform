import { SecretInput } from "@/components/ui/secret-input";
import { cn } from "@/lib/utils";

export const checkoutInputClassName =
  "w-full rounded-xl border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary focus:ring-ring/30 transition-colors disabled:opacity-60";

type CheckoutFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inputMode?: "tel" | "numeric" | "text";
  type?: string;
  multiline?: boolean;
  secret?: boolean;
};

export function CheckoutField({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  inputMode,
  type = "text",
  multiline,
  secret,
}: CheckoutFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(checkoutInputClassName, "resize-y min-h-[96px]")}
        />
      ) : secret ? (
        <SecretInput
          id={id}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={checkoutInputClassName}
          toggleShowLabel="CVC'yi göster"
          toggleHideLabel="CVC'yi gizle"
        />
      ) : (
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={checkoutInputClassName}
        />
      )}
    </div>
  );
}
