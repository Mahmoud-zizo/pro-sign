"use client";

import { FieldLabel, Input } from "./FormFields";
import { StepProps } from "./types";

export default function StepOne({ data, errors, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel required>Full Name</FieldLabel>
        <Input
          value={data.customerName}
          onChange={(v) => update("customerName", v)}
          placeholder="e.g. Ahmed Hassan"
          maxLength={80}
          error={errors.customerName}
        />
      </div>

      <div>
        <FieldLabel required>Phone Number</FieldLabel>
        <Input
          value={data.phoneNumber}
          onChange={(v) => update("phoneNumber", v)}
          placeholder="e.g. +20 100 000 0000"
          maxLength={20}
          error={errors.phoneNumber}
        />
      </div>

      <div>
        <FieldLabel required>Address</FieldLabel>
        <Input
          value={data.address}
          onChange={(v) => update("address", v)}
          placeholder="e.g. 12 Tahrir St, Cairo, Egypt"
          maxLength={200}
          error={errors.address}
        />
      </div>
    </div>
  );
}
