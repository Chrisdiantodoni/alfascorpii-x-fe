import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "./TextInput";

interface ProductSearchInputProps {
  className?: string;
  placeholder?: string;
  label?: string;
}

export function ProductSearchInput({
  className,
  placeholder,
  label,
}: ProductSearchInputProps) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<
    string,
    string | undefined
  >;
  const [value, setValue] = useState(search.q || "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue(search.q || "");
  }, [search.q]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setValue(v);

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        navigate({
          search: (prev: Record<string, unknown>) => {
            const updated = { ...prev };
            if (v.trim()) {
              updated.q = v.trim();
            } else {
              delete updated.q;
            }
            return updated;
          },
          replace: true,
        });
      }, 300);
    },
    [navigate],
  );

  return (
    <TextInput
      label={label ?? "Cari"}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className={className}
    />
  );
}
