import * as React from "react";

export function Card({ className, ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-900 p-4 ${className}`}
      {...props}
    />
  );
}
