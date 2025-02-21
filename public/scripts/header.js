document.addEventListener('DOMContentLoaded', function () {

  let today = new Date();
  let dayOfWeek = today.getDay();

  if (dayOfWeek === 4) {
    document.querySelector('.header__promo').style.display = 'block';
  }

  // Фишка при клике
  let headerContainer = document.querySelector('.header__container');
  headerContainer.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});