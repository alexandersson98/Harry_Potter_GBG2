export function locationList() {
  return `
    <div class="modal" id="locationModal" role="dialog" aria-modal="true" aria-labelledby="locationModalTitle" hidden>
      <button class="modal-close" id="locationModalClose" type="button" aria-label="Close">×</button>

      <div class="modal-head">
        <h2 id="locationModalTitle" class="modal-title">Title</h2>
        <p id="locationModalSub" class="modal-sub">Type</p>
      </div>

      <div class="modal-body">
        <div class="modal-left">
          <button id="locationModalFav" class="modal-fav" type="button">☆ Favorite</button>
        </div>
        <div class="modal-right" id="locationModalInfo"></div>
      </div>
    </div>
  `;
}