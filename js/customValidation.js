function CustomValidation() { }

CustomValidation.prototype = {
  // Установим пустой массив сообщений об ошибках
  invalidities: [],

  // Метод, проверяющий валидность
  checkValidity: function(input) {
    //var validity = input.validity;
    
    var min = input.getAttribute('minlength');
    if (min) {      
      this.addInvalidity('Минимальная длина строки = ' + min);
    }
    var max = input.getAttribute('maxlength');
    if (max) {
      this.addInvalidity('Максимальная длина строки = ' + max);
    }

  },

  // Добавляем сообщение об ошибке в массив ошибок
  addInvalidity: function(message) {
    this.invalidities.push(message);
  },

  // Получаем общий текст сообщений об ошибках
  getInvalidities: function() {
    return this.invalidities.join('. \n');
  },

  // Очищаем список invalidities
  clearInvalidities: function() {
    return this.invalidities.length = 0;
  }
};

/*
// Добавляем обработчик клика на кнопку отправки формы
submit.addEventListener('click', function(e) {
  // Пройдёмся по всем полям
  for (var i = 0; i < inputs.length; i++) {

    var input = inputs[i];

    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (input.checkValidity() == false) {

      var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.checkValidity(input); // Выявим ошибки
      var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

    } // закончился if
  } // закончился цикл
});
*/