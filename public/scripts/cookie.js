document.addEventListener('DOMContentLoaded', () => {
  const cookieBlock = document.getElementById('cookieBlock');
  const cookieButton = document.getElementById('cookieButton');

  // Проверяем, есть ли кука с именем 'cookieAccepted'
  if (!checkCookie('cookieAccepted')) {
    setTimeout(() => {
      cookieBlock.style.display = 'flex';
    }, 1500);
  }

  cookieButton.addEventListener('click', () => {
    cookieBlock.style.display = 'none';
    // Устанавливаем куку 'cookieAccepted' в значение 'true'
    setCookie('cookieAccepted', 'true', 365);
  });

  // Функция для установки куки
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Функция для проверки наличия куки
  function checkCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0].trim() === name) {
        return true;
      }
    }
    return false;
  }

});