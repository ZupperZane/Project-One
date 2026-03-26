import { useState } from "react";

export default function SavedSites() {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#dbeafe");

  function handleSubmit(e: any) {
    e.preventDefault();

    let finalUrl = url;

    // add https if user didn't type it
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      finalUrl = "https://" + url;
    }

    const site = {
      label: label,
      url: finalUrl,
      color: color,
    };

    console.log("Site submitted:", site);

    // clear form
    setLabel("");
    setUrl("");
    setColor("#dbeafe");
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "550px",
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
          color: "white",
          padding: "18px 20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Saved Sites</h2>
        <p style={{ margin: "6px 0 0 0", fontSize: "14px" }}>
          Add quick-access links
        </p>
      </div>

      <div style={{ padding: "20px", backgroundColor: "white" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <input
            type="text"
            placeholder="Website Name"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
            }}
          />

          <input
            type="text"
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "10px 12px",
            }}
          >
            <span>Choose card color</span>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: "48px",
                height: "36px",
                border: "none",
                cursor: "pointer",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  );
}