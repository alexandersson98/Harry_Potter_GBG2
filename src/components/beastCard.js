export function beastList(){
  return  `
  <div class="modal" id="beastModal" role="dialog" aria-modal="true" aria-labelledby="beastModalTitle" hidden>
    <button class="modal-close" id="beastModalClose" type="button" aria-label="Close">×</button>

    <div class="modal-head">
      <h2 id="beastModalTitle" class="modal-title">Title</h2>
      <p id="beastModalSub" class="modal-sub">Species · Classification</p>
    </div>

    <div class="modal-body">
      <div class="modal-left">
        <img id="beastModalImg" class="modal-img" alt="" />
        <button id="beastModalFav" class="modal-fav" type="button">☆ Favorite</button>
      </div>

      <div class="modal-right" id="beastModalInfo"></div>
    </div>
  </div>
    `
}