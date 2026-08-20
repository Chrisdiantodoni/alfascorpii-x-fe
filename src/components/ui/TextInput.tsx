import { type ComponentProps, forwardRef } from "react";

type BaseProps = {
  label: string;
  error?: string;
  optional?: boolean;
  fontSize?: number;
  required?: boolean;
  className?: string; // Menambahkan dukungan className luar
};

export type TextInputProps = Omit<
  ComponentProps<"input">,
  "className" | "ref" | "required"
> &
  BaseProps & {
    multiline?: never;
    rows?: never;
  };

type TextAreaProps = Omit<
  ComponentProps<"textarea">,
  "className" | "ref" | "required"
> &
  BaseProps & {
    multiline: true;
    rows?: number;
  };

type Props = TextInputProps | TextAreaProps;

const inputCls =
  "w-full appearance-none border-0 border-b border-line bg-transparent outline-none px-[2px] py-[10px] text-[15px] text-ink focus:border-b-blue-bright transition-colors placeholder:text-[#9CA3AF]";

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>(function TextInput(props, ref) {
  const {
    label,
    error,
    optional,
    fontSize = 11,
    required,
    multiline,
    id: idProp,
    name,
    className = "",
    ...rest
  } = props;
  const id = idProp ?? name;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={id}
        style={{ fontSize: `${fontSize}px` }}
        className="tracking-widest text-ash flex items-center gap-1"
      >
        <span>{label}</span>

        {required && (
          <span
            className="text-red-700 font-bold text-[12px] leading-none"
            title="Wajib diisi"
          >
            *
          </span>
        )}

        {optional && (
          <span className="text-ash/60 text-[10px] lowercase">(opsional)</span>
        )}
      </label>

      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={id}
          name={name}
          required={required}
          rows={(props as TextAreaProps).rows ?? 4}
          className={`${inputCls} resize-none`}
          {...(rest as ComponentProps<"textarea">)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          name={name}
          required={required}
          className={inputCls}
          {...(rest as ComponentProps<"input">)}
        />
      )}

      {error && (
        <span className="text-[11px] text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
});
