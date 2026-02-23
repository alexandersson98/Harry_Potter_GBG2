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

export function createModalController({ backdropId, modalId, closeId }) {
  const backdrop = document.getElementById(backdropId);
  const modal = document.getElementById(modalId);
  const btnClose = document.getElementById(closeId);

  if (!backdrop || !modal || !btnClose) {
    console.error("modalController: one or more elements cant be found.", {
      backdropId,
      modalId,
      closeId,
    });
    return null;
  }

  let lastFocus = null;
  let active = null;      
  let onClose = null;      

  function open(dataObj, renderFn, closeCallback) {
    active = dataObj;
    onClose = closeCallback ?? null;

    if (typeof renderFn === "function") {
      renderFn(modal, dataObj);
    }

    lastFocus = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }


  


  function close() {
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    active = null;

    if (typeof onClose === "function") onClose();
    lastFocus?.focus?.();
  }


  function getActive() {
    return active;
  }

  function isOpen() {
    return !modal.hidden;
  }


  function _onKeydown(e) {
    if (!modal.hidden && e.key === "Escape") close();
  }

  function _onBackdrop(e) {
    if (e.target === backdrop) close();
  }

  btnClose.addEventListener("click", close);
  backdrop.addEventListener("click", _onBackdrop);
  window.addEventListener("keydown", _onKeydown);


  function destroy() {
    btnClose.removeEventListener("click", close);
    backdrop.removeEventListener("click", _onBackdrop);
    window.removeEventListener("keydown", _onKeydown);
  }

  return { open, close, getActive, isOpen, destroy };
}