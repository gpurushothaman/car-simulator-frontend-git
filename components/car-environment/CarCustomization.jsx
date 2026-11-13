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

const sectionStyle = {
  flex: "1 1 220px",
  minWidth: 0,
};

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

function OptionGroup({ title, options, value, onChange }) {
  return (
    <section style={sectionStyle}>
      <label style={labelStyle}>{title}</label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {options?.filter((option, index) => index !== 0).map((option) => (
          <button
            key={option._id}
            type="button"
            aria-pressed={value === option._id}
            onClick={() => onChange(option._id, option)}
            style={buttonStyle(value === option._id)}
          >
            {option?.tyreName ||
              option?.steeringName ||
              option?.spoilerName ||
              option?.frontbumperName ||
              option?.rearbumperName}
          </button>
        ))}
      </div>
    </section>
  );
}

function getDefaultValue(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) {
    return fallback;
  }

  const selected = options.find((item) => item.default);

  return selected ?? options[0];
}

export default function CarCustomization({ customization, dispatch }) {
  console.log("track:", customization);
  const handleChangeTyre = (selectedTyre) => {
    dispatch(setTyre(selectedTyre));
  };

  const handleReset = () => {
    dispatch(
      setInitialCustomization({
        tyre: getDefaultValue(
          customization?.customizationData?.tyres,
          INITIAL_CAR_CUSTOMIZATION_STATE.tyre
        ),

        steering: getDefaultValue(
          customization?.customizationData?.steering,
          INITIAL_CAR_CUSTOMIZATION_STATE.steering
        ),

        spoiler: getDefaultValue(
          customization?.customizationData?.spoiler,
          INITIAL_CAR_CUSTOMIZATION_STATE.spoiler
        ),

        rearBumper: getDefaultValue(
          customization?.customizationData?.rearbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.rearBumper
        ),

        frontBumper: getDefaultValue(
          customization?.customizationData?.frontbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.frontBumper
        ),

        customizationData: customization?.customizationData,
      })
    );
  };

  return (
    <section
      style={{
        padding: "24px",
        background: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
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
          <div>
            <h2 style={{ margin: 0, fontSize: 23 }}>Customize Your Car</h2>

            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: 14,
              }}
            >
              Select your preferred car parts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleReset()}
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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 28,
          }}
        >
          <OptionGroup
            title="Tyres"
            options={customization?.customizationData?.tyres}
            value={customization?.customizationData?.tyres}
            onChange={(value, selectedTyre) => handleChangeTyre(selectedTyre)}
          />

          <OptionGroup
            title="Steering Wheels"
            options={customization?.customizationData?.steering}
            value={customization?.customizationData?.steering}
            onChange={(value, selectedSteering) =>
              dispatch(setSteering(selectedSteering))
            }
          />

          <OptionGroup
            title="Spoilers"
            options={customization?.customizationData?.spoiler}
            value={customization?.customizationData?.spoiler}
            onChange={(value, selectedSpoiler) =>
              dispatch(setSpoiler(selectedSpoiler))
            }
          />

          <OptionGroup
            title="Front Bumpers"
            options={customization?.customizationData?.frontbumper}
            value={customization?.customizationData?.frontbumper}
            onChange={(value, selectedFrontBumper) =>
              dispatch(setFrontBumper(selectedFrontBumper))
            }
          />

          <OptionGroup
            title="Rear Bumpers"
            options={customization?.customizationData?.rearbumper}
            value={customization?.customizationData?.rearbumper}
            onChange={(value, selectedRearBumper) =>
              dispatch(setRearBumper(selectedRearBumper))
            }
          />
        </div>
      </div>
    </section>
  );
}
