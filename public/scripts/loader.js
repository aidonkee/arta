// Удаление параметра fbclid из URL, если открыто через Instagram
let ua = navigator.userAgent || navigator.vendor || window.opera;
let isInstagram = ua.indexOf('Instagram') > -1;
if (isInstagram && window.location.href.includes('fbclid')) {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.delete('fbclid');
  window.location.href = currentUrl.href;
}

// Показ лоадера сразу после начала загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('#loader').style.display = 'flex';
  document.querySelector('.wrapper').style.display = 'none';
});

// Анимация SVG и логотипа
gsap.fromTo(
  "#svg path",
  { strokeDashoffset: 4500, fillOpacity: 0 },
  { strokeDashoffset: 0, fillOpacity: 1, duration: 2, ease: "power1.inOut" }
);

gsap.fromTo(
  "#logo-name",
  {
    y: 50,
    opacity: 0,
  },
  {
    y: 0,
    opacity: 1,
    duration: 1.5,
    delay: 0.5,
  }
);

// Убираем лоадер после загрузки всех ресурсов
window.addEventListener("load", function () {
  gsap.to("#loader", {
    opacity: 0,
    display: "none",
    duration: 0.5,
    delay: 2,
    onComplete: function () {
      document.querySelector('.wrapper').style.display = 'flex';
      new WOW().init();
    }
  });
});
