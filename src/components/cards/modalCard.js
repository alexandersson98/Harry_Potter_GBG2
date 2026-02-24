export function modalCard(prefix) {
  return `
    <div class="modal-backdrop" id="${prefix}ModalBackdrop" hidden></div>
    <div class="modal" id="${prefix}Modal" role="dialog" aria-modal="true" aria-labelledby="${prefix}ModalTitle" hidden>
      <button class="modal-close" id="${prefix}ModalClose" type="button" aria-label="Close">×</button>
      <div class="modal-head">
        <h2 id="${prefix}ModalTitle" class="modal-title">Title</h2>
        <p id="${prefix}ModalSub" class="modal-sub"></p>
      </div>
      <div class="modal-body">
        <div class="modal-left">
          <img id="${prefix}ModalImg" class="modal-img" alt="" />
          <button id="${prefix}ModalFav" class="modal-fav" type="button" aria-pressed="false">☆ Favorite</button>
        </div>
        <div class="modal-right" id="${prefix}ModalInfo"></div>
      </div>
    </div>
  `;
}