document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vin-form");
  const vinInp = document.getElementById("vin");
  const brand = document.getElementById("brand");
  const btn = document.getElementById("lookup-btn");
  const result = document.getElementById("result");

  if (!form || !vinInp || !brand || !btn || !result) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    result.innerHTML = `<div class="loading">Looking up…</div>`;
    btn.disabled = true;

    let vin = vinInp.value.trim().toUpperCase().replace(/\s+/g, "");
    const br = brand.value;

    // VIN validation
    if (vin.length !== 17 || /[IOQ]/.test(vin) || /[^A-Z0-9]/.test(vin)) {
      result.textContent =
        "Please enter a valid 17-character VIN (no I, O, or Q).";
      btn.disabled = false;
      return;
    }

    let account = document.getElementById("account").value.trim().toUpperCase();

    // Wholesale Account validation
    // must start with "WP" and be exactly 6 characters
    if (!/^WP[A-Z0-9]{4}$/.test(account)) {
      result.textContent = "Please enter a valid Wholesale Account #.";
      btn.disabled = false;
      return;
    }

    const url = `/api/vincolorlookup?vin=${encodeURIComponent(
      vin
    )}&brand=${encodeURIComponent(br)}`;

    try {
      const res = await fetch(url, { method: "GET" });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {}
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

      if (data?.ExteriorColor) {
        result.innerHTML = `
          <div><strong>Account #:</strong> ${account}</div>
          <div><strong>Exterior Color:</strong> ${data.ExteriorColor}</div>
        `;
      } else {
        result.innerHTML = `
          <div><strong>Account:</strong> ${account}</div>
          <div>No color found for VIN ${vin}.</div>
        `;
      }
    } catch (err) {
      console.error("[vincolor] error", err);
      result.textContent = "Error looking up the color.";
    } finally {
      btn.disabled = false;
    }
  });
});
