//Объект с сохраненными ответами

let answers = {
    2: null,
    3: null,
    4: null,
    5: null,
    6: null
};

// Движение вперед
let btnNext = document.querySelectorAll('[data-nav="next"]');
btnNext.forEach(function(button) {
    button.addEventListener('click', function() {
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
        //Проверка, есть ли у текущей карточки, аттрибут novalidate
        if (thisCard.dataset.validate == 'novalidate') {
            navigate("next", thisCard);
            updateProgressBar('next', thisCardNumber);
        } else {
            saveAnswers(thisCardNumber, gatherCardData(thisCardNumber));

            // isFilled(thisCardNumber);

            //Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate("next", thisCard);
                updateProgressBar('next', thisCardNumber);
            } else {
                alert('Сделайте ответ, прежде чем переходить далее');
            }
        }
    });
});

// Движение назад
let btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button) {
    button.addEventListener('click', function() {
        // Определяем текущую карточку
        let thisCard = this.closest("[data-card]");
        let thisCardNumber = parseInt(thisCard.dataset.card);
        navigate("prev", thisCard);
        updateProgressBar('prev', thisCardNumber);
    });
});

function navigate(direction, thisCard) {
    // Определяем номер текущей карточки
    let thisCardNumber = parseInt(thisCard.dataset.card);
    // Проверяем какое значение в direction и уменьшаем или увеличиваем на 1
    let nextCard;
    if (direction == 'next') {
        nextCard = thisCardNumber + 1;
    } else if (direction == 'prev') {
        nextCard = thisCardNumber - 1;
    }

    // Скрываем текущую карточку
    thisCard.classList.add('hidden');
    // Показываем следущую карточку
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");
}

// Проверка на ввод данных
// Получаем (сбор) данных с карточек
// Записываем все введенные данные
// Валидация
// Реализовать работу прогресс an
// Подсветка рамки для радио и чекбоксов


//Функция по сбору заполненных данных с карточки
function gatherCardData(number) {

    var question;
    var result = [];

    // Находим карточку по номеру и data-атрибуту
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    // Находим главный вопрос карточки
    question = currentCard.querySelector("[data-question]").innerText;

    // 1. Находим все заполненные значения из радио кнопок
    var radioValues = currentCard.querySelectorAll('[type="radio"]');

    // Проходим по радиокнопка и смотрим которые выбраны
    radioValues.forEach(function(item) {
        if (item.checked) {
            //Пушим в массив значения которые получили при выборе 
            result.push({
                name: item.name,
                value: item.value
            });
        }
    });


    //2 Находим все заполненные значения из чекбоксов
    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
    checkBoxValues.forEach(function(item) {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    })

    //3 Находим все заполненные значения из инпутов
    let inputValues = currentCard.querySelectorAll('[type="text"],[type="email"],[type="number"]');

    inputValues.forEach(function(item) {
        itemValue = item.value;
        if (itemValue.trim() != '') {
            result.push({
                name: item.name,
                value: item.value,
            });
        }
    })

    var data = {
        question: question,
        answer: result
    };

    return data;
}

// Функция записи ответа в объект с ответами
function saveAnswers(number, data) {
    answers[number] = data;
}
//Функция проверки на заполненность
function isFilled(number) {
    return answers[number].answer.length > 0;
}

//Валидация имейла
function validateEmail(email) {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email);
}


// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number) {
    var currentCard = document.querySelector(`[data-card="${number}"]`);
    var requiredFields = currentCard.querySelectorAll("[required]");

    let isValid = true;

    requiredFields.forEach(function(item) {
        if ((item.type == "checkbox" && item.checked == false) || (item.type == "email" && !validateEmail(item.value))) {
            isValid = false;
        }
    });
    return isValid;

}

//Подсвечиваем рамку у радиокнопки

document.querySelectorAll('.radio-group').forEach(function(item) {
    item.addEventListener('click', function(e) {
        //Проверяем где произошел клик - внути тега label или нет
        let label = e.target.closest('label');
        if (label) {
            //Отменяем активный класс у всех тегов label
            label.closest('.radio-group').querySelectorAll('label').forEach(function(item) {
                    item.classList.remove('radio-block--active');
                })
                //Добавляем активный класс к label по которому был клик
            label.classList.add('radio-block--active');
        }
    })
})

//Подсветка рамки у всех чекбоксов
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item) {
    item.addEventListener('change', function() {
        //Если чекбокс поставлен то
        if (item.checked) {
            //Добавляем активный класс к тегу labal в котором он лежит
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            //В ином случаем убираем активный класс
            item.closest("label").classList.remove('checkbox-block--active--active');
        }
    })
})

//Отображение прогресс бара
function updateProgressBar(direction, cardNumber) {
    //Рсчет всего кол-ва карточек
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length;

    //Текущая карточка
    //Проверка направления перемещения
    if (direction === 'next') {
        cardNumber = cardNumber + 1;
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1;
    }

    //Расчет процентов прохождения
    let progress = ((cardNumber * 100) / cardsTotalNumber).toFixed();

    //Обновляем прогресс бар

    let progressBar = document
        .querySelector(`[data-card="${cardNumber}"]`)
        .querySelector(".progress");
    if (progressBar) {
        //Обновнить число прогресс бара
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
        //Обновить полоску прогресс бара
        progressBar.querySelector(".progress__line-bar").style = `width: ${progress}%`;
    }
}