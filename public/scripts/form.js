// Смена placeholder в форме
const phoneRadio = document.getElementById("phone");
const telegramRadio = document.getElementById("telegram");
const emailRadio = document.getElementById("email");
const inputField = document.querySelector(".field-phone");
let mask = null;

// Обработчик события при изменении радио-кнопок
function handleRadioChange() {

  if (mask) {
    mask.destroy();
    mask = null;
  }

  function getSelectedLang() {
    const pathParts = window.location.pathname.split('/').filter(Boolean); // Разделяем путь и удаляем пустые части
    return ['en', 'ru', 'de'].includes(pathParts[pathParts.length - 1]) ? pathParts[pathParts.length - 1] : 'ru'; // Возвращаем последний элемент массива, если он является языком, иначе 'ru'
  }

  const selectedLang = getSelectedLang();

  if (phoneRadio.checked) {
    inputField.value = "";
    if (selectedLang === "en") {
      inputField.placeholder = "Enter phone";
      inputField.name = "Phone";
    } else if (selectedLang === "de") {
      inputField.placeholder = "Telefon eingeben";
      inputField.name = "Telefon";
    } else {
      inputField.placeholder = "Введите телефон";
      inputField.name = "Телефон";
    }

    // Установите маску для телефона
    mask = IMask(inputField, {
      mask: [
        {
          mask: '+0 (000) 000-00-00',
          startsWith: '7',
          country: 'Russia'
        },
        {
          mask: '0 (000) 000-00-00',
          startsWith: '8',
          country: 'KZ'
        },
        {
          mask: '+1 (000) 000-00-00',
          startsWith: '1',
          country: 'USA'
        },
        {
          mask: '+44 (000) 000-00-00',
          startsWith: '44',
          country: 'UK'
        },
        {
          mask: '+91 (000) 000-00-00',
          startsWith: '91',
          country: 'India'
        },
        {
          mask: '+86 (000) 0000-0000',
          startsWith: '86',
          country: 'China'
        },
        {
          mask: '+49 (000) 0000-0000',
          startsWith: '49',
          country: 'Germany'
        },
        {
          mask: '+000000000000000',
          startsWith: '',
          country: 'unknown'
        }
      ],
      dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
      }
    });
  } else if (telegramRadio.checked) {
    inputField.value = "";
    if (selectedLang === "en") {
      inputField.placeholder = "Enter whatsapp";
      inputField.name = "Whatsapp";
    } else if (selectedLang === "de") {
      inputField.placeholder = "Whatsapp eingeben";
      inputField.name = "Whatsapp";
    } else {
      inputField.placeholder = "Введите телеграм";
      inputField.name = "Телеграм";
    }
    if (mask) {
      mask.destroy();
      mask = null;
    }
  } else if (emailRadio.checked) {
    inputField.value = "";
    if (selectedLang === "en") {
      inputField.placeholder = "Enter email";
      inputField.name = "Email";
    } else if (selectedLang === "de") {
      inputField.placeholder = "Email eingeben";
      inputField.name = "Email";
    } else {
      inputField.placeholder = "Введите почту";
      inputField.name = "Почта";
    }
    if (mask) {
      mask.destroy();
      mask = null;
    }
  }
}


handleRadioChange();

// Добавляем обработчик события к каждой радио-кнопке
phoneRadio.addEventListener("change", handleRadioChange);
telegramRadio.addEventListener("change", handleRadioChange);
emailRadio.addEventListener("change", handleRadioChange);

let langElements = document.querySelectorAll(".lang-label");
langElements.forEach(function (langElement) {
  langElement.addEventListener("click", handleRadioChange);
});

// Данные с формы и отправка в telegram.php
const fields = document.querySelectorAll('.field-data');
const submitButton = document.querySelector('#submitButton');
const message = document.querySelector('.message');
const form = document.querySelector('.form')
const formData = {};

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  message.style.cssText = '';

  // Добавление вызова пикселя Facebook для отслеживания события Lead
  fbq('track', 'Lead');

  // Или применить методы очистки к объекту
  Object.keys(formData).forEach(key => delete formData[key]);

  // Отключите кнопку и покажите loader
  submitButton.setAttribute('disabled', 'disabled');
  document.querySelector('.loader').style.display = 'block';
  document.querySelector('#button-hide-text').style.opacity = 0;

  // Собрать данные с формы
  fields.forEach((field) => {
    const { name, value } = field;
    formData[name] = value;
  })

  // Получение выбранного языка из localStorage
  let selectedLang = localStorage.getItem("selectedLang");
  // Объект с фразами на разных языках
  const messages = {
    ru: {
      successMessage: 'отправлено',
      successSubtitle: 'Мы свяжемся с вами <br> ближайшее время',
      errorMessage: 'Ошибка',
      errorSubtitle: 'Что-то пошло не так <br> попробуйте еще раз'
    },
    en: {
      successMessage: 'sent',
      successSubtitle: 'We will contact you <br> as soon as possible',
      errorMessage: 'Error',
      errorSubtitle: 'Something went wrong <br> please try again'
    },
    de: {
      successMessage: 'gesendet',
      successSubtitle: 'Wir werden uns so schnell wie möglich <br> mit Ihnen in Verbindung setzen',
      errorMessage: 'Fehler',
      errorSubtitle: 'Etwas ist schief gelaufen <br> Bitte versuchen Sie es erneut'
    }
  };

  // Получение соответствующих сообщений для выбранного языка
  const { successMessage, successSubtitle, errorMessage, errorSubtitle } = messages[selectedLang] || messages['ru'];

  fetch('/api/telegram.php', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(data => {

      // Включите кнопку и скройте loader
      submitButton.removeAttribute('disabled');
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('#button-hide-text').style.opacity = 1;

      if (data === 'success') {
        message.style.cssText = 'animation-name: slideOutLeft;';
        document.querySelector('.message__title').innerHTML = successMessage;
        document.querySelector('.message__subtitle').innerHTML = successSubtitle;
        message.classList.add('success');
        message.classList.remove('error');
        form.reset()
        handleRadioChange();
        submitButton.setAttribute('disabled', 'disabled'); // Отключите кнопку
      } else {
        message.style.cssText = 'animation-name: slideOutLeft;';
        document.querySelector('.message__title').innerHTML = errorMessage;
        document.querySelector('.message__subtitle').innerHTML = errorSubtitle;
        message.classList.add('error');
        message.classList.remove('success');
      }
    })
    .catch(error => {
      message.style.cssText = 'animation-name: slideOutLeft;';
      document.querySelector('.message__title').innerHTML = errorMessage;
      document.querySelector('.message__subtitle').innerHTML = errorSubtitle;
      message.classList.add('error');
      message.classList.remove('success');
    });

})


// Проверка на пустоту полей и отображение состояния кнопки disabled
function checkFields() {
  // Переменная для отслеживания состояния полей
  let allFieldsFilled = true;

  // Перебираем все поля ввода, кроме textarea, и проверяем, заполнены ли они
  fields.forEach((field) => {
    if (field.value.trim() === '' && !field.classList.contains('textarea')) {
      allFieldsFilled = false;
    }
  });

  // Устанавливаем атрибут disabled для кнопки в зависимости от состояния полей
  if (allFieldsFilled) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', 'disabled');
  }
}

// Добавляем слушатель события на изменения в полях ввода
fields.forEach((field) => {
  field.addEventListener('input', checkFields);
});

// Вызываем функцию для первичной проверки состояния полей при загрузке страницы
checkFields();

// Логика отправки формы для футера
const footerSubmitButton = document.querySelector('#footerSubmitButton');
const footerInputField = document.querySelector('#footerInputField');

footerSubmitButton.addEventListener('click', (e) => {
  e.preventDefault();
  message.style.cssText = '';

  const formData = {
    [footerInputField.name]: footerInputField.value
  };

  // Получение выбранного языка из localStorage
  let selectedLang = localStorage.getItem("selectedLang");
  // Объект с фразами на разных языках
  const messages = {
    ru: {
      successMessage: 'отправлено',
      successSubtitle: 'Мы свяжемся с вами <br> ближайшее время',
      errorMessage: 'Ошибка',
      errorSubtitle: 'Что-то пошло не так <br> попробуйте еще раз'
    },
    en: {
      successMessage: 'sent',
      successSubtitle: 'We will contact you <br> as soon as possible',
      errorMessage: 'Error',
      errorSubtitle: 'Something went wrong <br> please try again'
    },
    de: {
      successMessage: 'gesendet',
      successSubtitle: 'Wir werden uns so schnell wie möglich <br> mit Ihnen in Verbindung setzen',
      errorMessage: 'Fehler',
      errorSubtitle: 'Etwas ist schief gelaufen <br> Bitte versuchen Sie es erneut'
    }
  };

  // Получение соответствующих сообщений для выбранного языка
  const { successMessage, successSubtitle, errorMessage, errorSubtitle } = messages[selectedLang] || messages['ru'];

  // Добавление вызова пикселя Facebook для отслеживания события Lead
  fbq('track', 'Lead');

  fetch('/api/telegram.php', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.text())
    .then(data => {

      // Включите кнопку и скройте loader
      submitButton.removeAttribute('disabled');
      document.querySelector('.loader').style.display = 'none';
      document.querySelector('#button-hide-text').style.opacity = 1;

      if (data === 'success') {
        message.style.cssText = 'animation-name: slideOutLeft;';
        document.querySelector('.message__title').innerHTML = successMessage;
        document.querySelector('.message__subtitle').innerHTML = successSubtitle;
        message.classList.add('success');
        message.classList.remove('error');
        footerInputField.value = ''
        submitButton.setAttribute('disabled', 'disabled'); // Отключите кнопку
      } else {
        message.style.cssText = 'animation-name: slideOutLeft;';
        document.querySelector('.message__title').innerHTML = errorMessage;
        document.querySelector('.message__subtitle').innerHTML = errorSubtitle;
        message.classList.add('error');
        message.classList.remove('success');
      }
    })
    .catch(error => {
      message.style.cssText = 'animation-name: slideOutLeft;';
      document.querySelector('.message__title').innerHTML = errorMessage;
      document.querySelector('.message__subtitle').innerHTML = errorSubtitle;
      message.classList.add('error');
      message.classList.remove('success');
    });
});

// Проверка на пустоту поля и отображение состояния кнопки disabled
function checkFooterField() {
  if (footerInputField.value.trim() === '') {
    footerSubmitButton.setAttribute('disabled', 'disabled');
  } else {
    footerSubmitButton.removeAttribute('disabled');
  }
}

// Добавляем слушатель события на изменения в поле ввода
footerInputField.addEventListener('input', checkFooterField);

// Вызываем функцию для первичной проверки состояния поля при загрузке страницы
checkFooterField();