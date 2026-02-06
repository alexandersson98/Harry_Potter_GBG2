# group-project-boiler-room-v5

 Pages ansvar:
- Definierar sidans struktur (layout placeholders).
- Anropar components för att rendera HTML.
- Hanterar mount-logik och dataflöde.

Ingen hårdkodad HTML ska genereras här.
All markup ska komma från components.
mountPostPage:
- Hämtar data baserat på route-parametrar.
- Stoppar in renderad HTML i rätt placeholders.
- Kopplar ihop data + UI.

Detta håller components rena och återanvändbara.

export function postPage() {
  return `
  ${navBar()}
  <main>
   <div id="postTitle"></div>
    <div id="postFull"></div>
  </main>
  ${footer()}
`;}


export function mountPostPage(params) {
    const post = getPostById(params.id);
    if(!post) return;

    document.getElementById("postTitle").innerHTML = postTitle(post);
     document.getElementById("postFull").innerHTML = postFull(post);
}









