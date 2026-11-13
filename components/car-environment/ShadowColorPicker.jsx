"use client";

export default function ShadowColorPicker({
  shadowColor,
  onShadowColorChange,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 12,
        background: "rgba(25, 25, 25, 0.9)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <label
        htmlFor="shadow-color"
        style={{ fontSize: 14, fontWeight: 600 }}
      >
        Shadow Color
      </label>

      <input
        id="shadow-color"
        type="color"
        value={shadowColor}
        onChange={(event) =>
          onShadowColorChange(event.target.value)
        }
        style={{
          width: 42,
          height: 36,
          padding: 2,
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          background: "transparent",
        }}
      />

      <span
        style={{
          fontSize: 12,
          color: "#ddd",
          minWidth: 70,
        }}
      >
        {shadowColor.toUpperCase()}
      </span>
    </div>
  );
}