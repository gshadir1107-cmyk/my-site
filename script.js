// Базовые настройки, легко поменять под бренд
const SITE = {
  brand: "BrandName",
  phoneDisplay: "+971 50 000 0000",
  phoneRaw: "971500000000",
  email: "hello@brandname.site",
};

// UI helpers
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Branding
$("#brandName").textContent = SITE.brand;
$("#brandName2").textContent = SITE.brand;
$("#phoneLink").href = `https://wa.me/${SITE.phoneRaw}`;
$("#phoneLink").textContent = `☎️ ${SITE.phoneDisplay}`;
$("#emailLink").href = `mailto:${SITE.email}`;
$("#emailLink").textContent = `✉️ ${SITE.email}`;
$("#year").textContent = new Date().getFullYear();

// Mobile nav
$("#navMobile").addEventListener("click", () => {
  $("#navMobileMenu").classList.toggle("open");
});

// Routing (псевдо-страницы)
function setRoute(id) {
  $$(".route").forEach(s => s.classList.add("hidden"));
  $(`#route-${id}`).classList.remove("hidden");
  // Закрыть меню на мобиле
  $("#navMobileMenu").classList.remove("open");
  window.scrollTo({top: 0, behavior: "smooth"});
  location.hash = id;
}
$$('[data-route]').forEach(btn => {
  btn.addEventListener("click", () => setRoute(btn.dataset.route));
});
// начальный маршрут
setRoute(location.hash.replace('#','') || "home");
window.addEventListener('hashchange', () => setRoute(location.hash.replace('#','') || "home"));

// Лиды
function getLeads(){ try { return JSON.parse(localStorage.getItem("leads")||"[]"); } catch { return []; } }
function setLeads(list){ localStorage.setItem("leads", JSON.stringify(list)); renderLeads(); }
function renderLeads(){
  const list = getLeads();
  const box = $("#leadsList");
  if(!box) return;
  if(list.length === 0){ box.innerHTML = '<div class="card"><div class="card-content muted">Пока пусто. Отправьте форму на странице «Контакты», чтобы увидеть лид здесь.</div></div>'; return; }
  box.innerHTML = "";
  list.forEach(l => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-content">
        <div class="grid-3" style="grid-template-columns: 1fr 1fr auto">
          <div>
            <div class="title">${l.name}</div>
            <div class="muted small">${new Date(l.createdAt).toLocaleString()}</div>
          </div>
          <div class="muted small">
            ${l.phone ? "📞 " + l.phone : ""} ${l.email ? " &nbsp; ✉️ " + l.email : ""}
          </div>
          <div>
            <select data-id="${l.id}" class="pill">
              ${["Новый","В работе","Успешно","Отказ"].map(s=>`<option ${s===l.status?"selected":""}>${s}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="muted" style="margin-top:6px">${l.message || "Без сообщения"}</div>
      </div>`;
    box.appendChild(card);
  });
  $$('select[data-id]', box).forEach(sel => {
    sel.addEventListener('change', e => {
      const id = +sel.dataset.id;
      const list = getLeads().map(x => x.id===id ? {...x, status: sel.value} : x);
      setLeads(list);
    });
  });
}
renderLeads();

// Форма
let source = "Сайт";
$$(".pill").forEach(b => b.addEventListener("click", () => {
  $$(".pill").forEach(x => x.classList.remove("selected"));
  b.classList.add("selected");
  source = b.dataset.source;
}));

$("#leadForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const phone = $("#phone").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  if(!name){ $("#error").textContent = "Укажите имя"; return; }
  if(!phone && !email){ $("#error").textContent = "Нужен телефон или email"; return; }
  $("#error").textContent = "";

  const lead = { id: Date.now(), createdAt: new Date().toISOString(), name, phone, email, message, source, status: "Новый" };
  const list = getLeads();
  list.unshift(lead);
  setLeads(list);

  // очистка формы
  $("#name").value = "";
  $("#phone").value = "";
  $("#email").value = "";
  $("#message").value = "";
  $$(".pill").forEach(x => x.classList.remove("selected"));
  $$(".pill")[0].classList.add("selected");
  source = "Сайт";

  // уведомление
  $("#toast").classList.remove("hidden");
  setTimeout(()=>$("#toast").classList.add("hidden"), 2200);

  setRoute("leads");
});
