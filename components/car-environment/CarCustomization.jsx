"use client";

import {
  INITIAL_CAR_CUSTOMIZATION_STATE,
  setTyre,
  setSteering,
  setSpoiler,
  setFrontBumper,
  setRearBumper,
} from "@/components/redux/carCustomization";
import { setInitialCustomization } from "@/components/redux/carCustomization/actions";

const sectionStyle = { flex: "1 1 220px", minWidth: 0 };
const labelStyle = {
  display: "block",
  marginBottom: 10,
  fontWeight: 700,
  fontSize: 15,
};

const buttonStyle = (active) => ({
  padding: "10px 14px",
  borderRadius: 8,
  border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
  background: active ? "#eff6ff" : "#ffffff",
  color: active ? "#1d4ed8" : "#374151",
  cursor: "pointer",
  fontWeight: active ? 700 : 500,
  fontSize: 13,
});

function getOptionId(option) {
  return option?._id ?? option?.id ?? option?.modelPath;
}

function getOptionLabel(option) {
  return (
    option?.tyreName ||
    option?.steeringName ||
    option?.spoilerName ||
    option?.frontbumperName ||
    option?.rearbumperName ||
    option?.name ||
    "Unnamed option"
  );
}

function OptionGroup({ title, options, value, onChange }) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <section style={sectionStyle}>
      <div style={labelStyle}>{title}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {safeOptions.map((option, index) => {
          const optionId = getOptionId(option);
          const active = value === optionId;

          return (
            <button
              key={optionId ?? `${title}-${index}`}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option)}
              style={buttonStyle(active)}
            >
              {getOptionLabel(option)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getDefaultValue(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) return fallback;
  return options.find((item) => item?.default) ?? options[0];
}

export default function CarCustomization({ customization, dispatch }) {
  const data = customization?.customizationData;

  const handleReset = () => {
    dispatch(
      setInitialCustomization({
        tyre: getDefaultValue(data?.tyres, INITIAL_CAR_CUSTOMIZATION_STATE.tyre),
        steering: getDefaultValue(data?.steering, INITIAL_CAR_CUSTOMIZATION_STATE.steering),
        spoiler: getDefaultValue(data?.spoiler, INITIAL_CAR_CUSTOMIZATION_STATE.spoiler),
        rearBumper: getDefaultValue(data?.rearbumper, INITIAL_CAR_CUSTOMIZATION_STATE.rearBumper),
        frontBumper: getDefaultValue(data?.frontbumper, INITIAL_CAR_CUSTOMIZATION_STATE.frontBumper),
        customizationData: data,
      })
    );
  };

  return (
    <section
      style={{
        padding: 24,
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
          }}
        >
         
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 28 }}>
          <OptionGroup
            title="Tyres"
            options={data?.tyres}
            value={getOptionId(customization?.tyre)}
            onChange={(option) => dispatch(setTyre(option))}
          />
          <OptionGroup
            title="Steering Wheels"
            options={data?.steering}
            value={getOptionId(customization?.steering)}
            onChange={(option) => dispatch(setSteering(option))}
          />
          <OptionGroup
            title="Spoilers"
            options={data?.spoiler}
            value={getOptionId(customization?.spoiler)}
            onChange={(option) => dispatch(setSpoiler(option))}
          />
          <OptionGroup
            title="Front Bumpers"
            options={data?.frontbumper}
            value={getOptionId(customization?.frontBumper)}
            onChange={(option) => dispatch(setFrontBumper(option))}
          />
          <OptionGroup
            title="Rear Bumpers"
            options={data?.rearbumper}
            value={getOptionId(customization?.rearBumper)}
            onChange={(option) => dispatch(setRearBumper(option))}
          />
        </div>
      </div>
    </section>
  );
}
