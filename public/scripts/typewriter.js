document.addEventListener('DOMContentLoaded', function () {
  function getSelectedLang() {
    const pathParts = window.location.pathname.split('/').filter(Boolean); // Разделяем путь и удаляем пустые части
    return ['en', 'ru', 'de'].includes(pathParts[pathParts.length - 1]) ? pathParts[pathParts.length - 1] : 'ru'; // Возвращаем последний элемент массива, если он является языком, иначе 'ru'
  }

  const selectedLang = getSelectedLang();

  const stringsByLang = {
    ru: ['Innovation', 'Team-work', 'Development', 'Invention'],
    en: ['Innovation', 'Team-work', 'Development', 'Invention'],
    de: ['Innovation', 'Team-work', 'Development', 'Invention']
  };

  let typed = new Typed('#typewriter', {
    strings: stringsByLang[selectedLang],
    typeSpeed: 100,
    backSpeed: 100,
    loop: true
  });
});