"use client";

import { FieldLabel, Input, NumberInput } from "./FormFields";
import { StepProps } from "./types";
import { CAR_YEAR_MIN, CAR_YEAR_MAX } from "./constants";

export default function StepTwo({ data, errors, update }: StepProps) {
  return (
    <div className="space-y-6">
      {/* Make + Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Car Make</FieldLabel>
          <Input
            value={data.carMake}
            onChange={(v) => update("carMake", v)}
            placeholder="e.g. Toyota"
            maxLength={50}
            error={errors.carMake}
          />
        </div>
        <div>
          <FieldLabel required>Car Model</FieldLabel>
          <Input
            value={data.carModel}
            onChange={(v) => update("carModel", v)}
            placeholder="e.g. Corolla"
            maxLength={50}
            error={errors.carModel}
          />
        </div>
      </div>

      {/* Year */}
      <div>
        <FieldLabel required>Year</FieldLabel>
        <NumberInput
          value={data.carYear}
          onChange={(v) => update("carYear", v)}
          placeholder={`e.g. ${new Date().getFullYear()}`}
          min={CAR_YEAR_MIN}
          max={CAR_YEAR_MAX}
          error={errors.carYear}
        />
      </div>
    </div>
  );
}
