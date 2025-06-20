import * as React from "react";

export function Label({ className, ...props }) {
  return (
    <label
      className={`text-sm font-medium text-white ${className}`}
      {...props}
    />
  );
}
