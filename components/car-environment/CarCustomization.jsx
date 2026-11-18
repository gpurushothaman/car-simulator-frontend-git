
"use client";

import { useEffect, useRef, useState } from "react";

import {
  INITIAL_CAR_CUSTOMIZATION_STATE,
  setTyre,
  setSteering,
  setSpoiler,
  setFrontBumper,
  setRearBumper,
} from "@/components/redux/carCustomization";

import { setInitialCustomization } from "@/components/redux/carCustomization/actions";

/* =================================
   OPTION HELPERS
================================= */

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

function getDefaultValue(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) {
    return fallback;
  }

  return options.find((item) => item?.default) ?? options[0];
}

/* =================================
   3D METALLIC SILVER ICONS
================================= */

function PartIcon({ type }) {
  const gradientId = `silver-metal-${type}`;
  const darkId = `dark-metal-${type}`;

  return (
    <svg
      className="car-part-icon"
      viewBox="0 0 80 60"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${type} icon`}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="20%" stopColor="#dce2e8" />
          <stop offset="45%" stopColor="#8995a2" />
          <stop offset="65%" stopColor="#f4f6f8" />
          <stop offset="85%" stopColor="#87919d" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <linearGradient
          id={darkId}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#697582" />
          <stop offset="45%" stopColor="#222b35" />
          <stop offset="100%" stopColor="#8995a1" />
        </linearGradient>
      </defs>

      {/* TYRE / ALLOY WHEEL */}
      {type === "tyres" && (
        <g>
          <ellipse
            cx="40"
            cy="31"
            rx="25"
            ry="25"
            fill="#111820"
            stroke="#75818d"
            strokeWidth="3"
          />

          <ellipse
            cx="40"
            cy="31"
            rx="19"
            ry="19"
            fill={`url(#${darkId})`}
            stroke="#c8d0d8"
            strokeWidth="2"
          />

          <ellipse
            cx="40"
            cy="31"
            rx="14"
            ry="14"
            fill={`url(#${gradientId})`}
            stroke="#f5f7fa"
            strokeWidth="1.5"
          />

          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 40 31)`}>
              <path
                d="M38 18 L42 18 L44 29 L40 31 L36 29 Z"
                fill="#f4f6f8"
                stroke="#677380"
                strokeWidth="0.8"
              />
            </g>
          ))}

          <circle cx="40" cy="31" r="5" fill={`url(#${darkId})`} />
          <circle cx="40" cy="31" r="2.2" fill="#ffffff" />
        </g>
      )}

      {/* STEERING WHEEL */}
      {type === "steering" && (
        <g>
          <circle
            cx="40"
            cy="28"
            r="22"
            fill="none"
            stroke={`url(#${darkId})`}
            strokeWidth="7"
          />

          <circle
            cx="40"
            cy="28"
            r="22"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
          />

          <path
            d="M40 28 L40 47 M40 28 L23 37 M40 28 L57 37"
            stroke={`url(#${gradientId})`}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          <circle
            cx="40"
            cy="28"
            r="7"
            fill={`url(#${gradientId})`}
            stroke="#ffffff"
            strokeWidth="1"
          />

          <circle cx="40" cy="28" r="3" fill="#5c6875" />
        </g>
      )}

      {/* SPOILER */}
      {type === "spoiler" && (
        <g>
          <path
            d="M13 38 L25 34 L55 34 L68 38 L63 43 L18 43 Z"
            fill="#151d26"
            opacity="0.55"
          />

          <path
            d="M18 20 L62 20 L72 28 L64 34 L16 34 L8 28 Z"
            fill={`url(#${darkId})`}
            stroke="#dce2e8"
            strokeWidth="1.2"
          />

          <path
            d="M18 20 L62 20 L72 28 L8 28 Z"
            fill={`url(#${gradientId})`}
            stroke="#ffffff"
            strokeWidth="1"
          />

          <path
            d="M24 34 L21 47 M56 34 L59 47"
            stroke={`url(#${gradientId})`}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* FRONT BUMPER */}
      {type === "front-bumper" && (
        <g>
          <path
            d="M12 18 Q40 8 68 18 L73 35 Q70 47 59 49 L21 49 Q10 47 7 35 Z"
            fill={`url(#${darkId})`}
            stroke="#dce2e8"
            strokeWidth="1.5"
          />

          <path
            d="M12 19 Q40 11 68 19 L65 32 Q40 39 15 32 Z"
            fill={`url(#${gradientId})`}
            stroke="#ffffff"
            strokeWidth="1"
          />

          <path
            d="M16 34 Q40 40 64 34 L59 44 L21 44 Z"
            fill="#202a34"
            stroke="#8995a1"
            strokeWidth="1"
          />

          <path
            d="M34 37 L46 37 L45 43 L35 43 Z"
            fill="#111820"
          />
        </g>
      )}

      {/* REAR BUMPER */}
      {type === "rear-bumper" && (
        <g>
          <path
            d="M11 19 Q40 10 69 19 L73 36 Q69 48 59 49 L21 49 Q11 47 7 36 Z"
            fill={`url(#${darkId})`}
            stroke="#dce2e8"
            strokeWidth="1.5"
          />

          <path
            d="M12 20 Q40 12 68 20 L65 33 Q40 39 15 33 Z"
            fill={`url(#${gradientId})`}
            stroke="#ffffff"
            strokeWidth="1"
          />

          <path
            d="M15 34 Q40 40 65 34 L60 44 L20 44 Z"
            fill="#242e38"
            stroke="#9da8b3"
            strokeWidth="1"
          />

          <path
            d="M32 38 L48 38 L46 44 L34 44 Z"
            fill="#101820"
          />
        </g>
      )}
    </svg>
  );
}

/* =================================
   OPTION DROPDOWN
================================= */

function OptionGroup({
  id,
  title,
  icon,
  options,
  value,
  isOpen,
  onToggle,
  onSelect,
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  const selectedOption = safeOptions.find(
    (option) => getOptionId(option) === getOptionId(value)
  );

  return (
    <section className="car-option-section">
      <button
        type="button"
        className={`car-option-trigger ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`dropdown-${id}`}
      >
        <span className="car-option-icon-wrap">
          <PartIcon type={icon} />
        </span>

        <span className="car-option-trigger-text">
          <span className="car-option-heading">
            {title}
          </span>

          <span className="car-option-selected">
            {selectedOption
              ? getOptionLabel(selectedOption)
              : "Select option"}
          </span>
        </span>

        <span className={`car-option-arrow ${isOpen ? "rotated" : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className="car-option-dropdown"
          id={`dropdown-${id}`}
        >
          {safeOptions.length > 0 ? (
            safeOptions.map((option, index) => {
              const active =
                getOptionId(value) === getOptionId(option);

              return (
                <button
                  key={getOptionId(option) ?? `${id}-${index}`}
                  type="button"
                  className={`car-dropdown-item ${
                    active ? "selected" : ""
                  }`}
                  onClick={() => onSelect(option)}
                >
                  <span>{getOptionLabel(option)}</span>

                  {active && (
                    <span className="option-check">✓</span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="car-dropdown-empty">
              No options available
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* =================================
   MAIN CUSTOMIZATION COMPONENT
================================= */

export default function CarCustomization({
  customization,
  dispatch,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Dropdown area reference
  const optionsRef = useRef(null);

  const data = customization?.customizationData;

  /* =================================
     CLICK OUTSIDE TO CLOSE
  ================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =================================
     RESET
  ================================= */

  const handleReset = () => {
    dispatch(
      setInitialCustomization({
        tyre: getDefaultValue(
          data?.tyres,
          INITIAL_CAR_CUSTOMIZATION_STATE.tyre
        ),

        steering: getDefaultValue(
          data?.steering,
          INITIAL_CAR_CUSTOMIZATION_STATE.steering
        ),

        spoiler: getDefaultValue(
          data?.spoiler,
          INITIAL_CAR_CUSTOMIZATION_STATE.spoiler
        ),

        rearBumper: getDefaultValue(
          data?.rearbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.rearBumper
        ),

        frontBumper: getDefaultValue(
          data?.frontbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.frontBumper
        ),

        customizationData: data,
      })
    );

    setOpenDropdown(null);
  };

  /* =================================
     TOGGLE DROPDOWN
  ================================= */

  const handleToggle = (id) => {
    setOpenDropdown((current) =>
      current === id ? null : id
    );
  };

  /* =================================
     SELECT OPTION
  ================================= */

  const handleSelect = (action, option) => {
    dispatch(action(option));
    setOpenDropdown(null);
  };

  return (
    <section className="car-custom-panel">
      <div className="car-custom-panel-inner">

        {/* RESET BUTTON */}

        <div className="custom-panel-heading">
          <button
            type="button"
            className="custom-reset-button"
            onClick={handleReset}
          >
            ↺ Reset
          </button>
        </div>

        {/* CATEGORY OPTIONS */}

        <div
          className="car-options-grid"
          ref={optionsRef}
        >
          <OptionGroup
            id="tyres"
            title="Tyres"
            icon="tyres"
            options={data?.tyres}
            value={customization?.tyre}
            isOpen={openDropdown === "tyres"}
            onToggle={() => handleToggle("tyres")}
            onSelect={(option) =>
              handleSelect(setTyre, option)
            }
          />

          <OptionGroup
            id="steering"
            title="Steering Wheels"
            icon="steering"
            options={data?.steering}
            value={customization?.steering}
            isOpen={openDropdown === "steering"}
            onToggle={() => handleToggle("steering")}
            onSelect={(option) =>
              handleSelect(setSteering, option)
            }
          />

          <OptionGroup
            id="spoiler"
            title="Spoilers"
            icon="spoiler"
            options={data?.spoiler}
            value={customization?.spoiler}
            isOpen={openDropdown === "spoiler"}
            onToggle={() => handleToggle("spoiler")}
            onSelect={(option) =>
              handleSelect(setSpoiler, option)
            }
          />

          <OptionGroup
            id="front-bumper"
            title="Front Bumpers"
            icon="front-bumper"
            options={data?.frontbumper}
            value={customization?.frontBumper}
            isOpen={openDropdown === "front-bumper"}
            onToggle={() => handleToggle("front-bumper")}
            onSelect={(option) =>
              handleSelect(setFrontBumper, option)
            }
          />

          <OptionGroup
            id="rear-bumper"
            title="Rear Bumpers"
            icon="rear-bumper"
            options={data?.rearbumper}
            value={customization?.rearBumper}
            isOpen={openDropdown === "rear-bumper"}
            onToggle={() => handleToggle("rear-bumper")}
            onSelect={(option) =>
              handleSelect(setRearBumper, option)
            }
          />
        </div>
      </div>
    </section>
  );
}
