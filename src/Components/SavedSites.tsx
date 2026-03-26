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
      color: color
    };

    console.log("Site submitted:", site);

    // clear form
    setLabel("");
    setUrl("");
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Saved Sites</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Website Name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <button type="submit">Submit</button>

      </form>
    </div>
  );
}