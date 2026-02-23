export function mountModal(prefix, data) {
  document.getElementById(`${prefix}ModalTitle`).textContent = data.name ?? "—";
  document.getElementById(`${prefix}ModalSub`).textContent = data.subtitle ?? "";

  const img = document.getElementById(`${prefix}ModalImg`);
  if (data.image) {
    img.src = data.image;
    img.alt = data.name ?? "";
    img.hidden = false;
  } else {
    img.hidden = true;
  }

  // Renderar info-fält från mappern
  const infoEl = document.getElementById(`${prefix}ModalInfo`);
  infoEl.innerHTML = (data.fields ?? [])
    .filter(f => f.value)
    .map(f => `
      <div class="modal-field">
        <span class="modal-field-label">${f.label}</span>
        <span class="modal-field-value">${f.value}</span>
      </div>
    `)
    .join("");
}