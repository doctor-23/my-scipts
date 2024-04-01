class CustomSelect {
    /**
     * Конструктор класса CustomSelect.
     * @param {string} method - Название метода инициализации. Может быть 'init', 'reinit' или 'destroy'.
     * @param {Object} options - Объект с настройками.
     * @param {HTMLElement} options.selectElement - HTML-элемент, представляющий оригинальный выпадающий список.
     * @param {number} [options.show=8] - Количество элементов, которые нужно показать в выпадающем списке без прокрутки (по умолчанию 8).
     * @param {string} [options.icon=null] - Иконка для кастомного выпадающего списка. По умолчанию используется null.
     */
    constructor(method, options) {
        // Сохраняем переданный элемент выпадающего списка и количество элементов, которые нужно показать
        this.select = options.selectElement;
        this.show = options.show || 6;
        this.icon = options.icon || null;
        this.isMobile = document.documentElement.clientWidth < 575.98;

        // Если метод инициализации равен 'init', инициализируем пользовательский выпадающий список
        if (method === 'init') {
            this.initCustomSelect(this.select);
        } else {
            // Если метод не 'init', проверяем, является ли элемент select
            if (this.select.nodeName === 'DIV') {
                // Если элемент DIV, находим все радио-кнопки внутри него
                this.options = this.select.querySelectorAll('input[type="radio"]');
                // Создаем стандартный выпадающий список
                this.defaultSelect = this.createDefaultSelect();
                // Заменяем пользовательский выпадающий список на стандартный
                this.replaceCustomWithDefault();

                // Если метод переинициализации равен 'reinit', повторно инициализируем пользовательский выпадающий список
                if (method === 'reinit') {
                    this.initCustomSelect(this.defaultSelect);
                }
            }
        }
    }

    /**
     * Инициализирует кастомный выпадающий список на основе оригинального элемента select.
     * @param {HTMLElement} select - HTML-элемент, представляющий оригинальный выпадающий список.
     */
    initCustomSelect(select) {
        // Получаем список опций выпадающего списка
        this.options = select.querySelectorAll('option');
        this.select = select;
        // Создаем кастомный выпадающий список и настраиваем его обработчики событий
        const customSelect = this.createCustomSelect(select);
        // Заменяем оригинальный выпадающий список кастомным
        this.replaceSelectWithCustom(customSelect);
        // Назначаем обработчики событий для кастомного выпадающего списка
        this.customSelectEvents(customSelect);
    }

    /**
     * Создает кастомный выпадающий список на основе переданного оригинального элемента select.
     * @param {HTMLElement} select - HTML-элемент, представляющий оригинальный выпадающий список.
     * @returns {HTMLElement} - HTML-элемент, представляющий кастомный выпадающий список.
     */
    createCustomSelect(select) {
        // Создаем новый div и копируем классы из оригинального селекта
        let selectClasses = Array.from(select.classList);
        let customSelect = document.createElement('div');
        selectClasses.forEach(className => customSelect.classList.add(className));
        customSelect.classList.add('custom-select')
        if (select.required) {
            customSelect.classList.add('required')
        }

        // Создаем заголовок и содержимое списка выбора
        let selectTitle = this.createCustomSelectTitle(customSelect);
        let selectContent = this.createCustomSelectContent(customSelect);

        // Добавляем заголовок и содержимое к новому выпадающему списку
        customSelect.append(selectTitle);
        customSelect.append(selectContent);

        return customSelect;
    }

    /**
     * Создает заголовок для кастомного выпадающего списка.
     * @returns {HTMLElement} - HTML-элемент, представляющий заголовок кастомного выпадающего списка.
     */
    createCustomSelectTitle(customSelect) {
        // Получаем все опции выбора и преобразуем их в массив
        let optionsArray = Array.from(this.options);

        // Находим выбранную опцию
        let selectedOption = optionsArray.find(option => option.selected);
        // Создаем элементы для заголовка кастомного селекта
        let selectTitle = document.createElement('div'); // Создаем div для обертки заголовка
        let selectTitleText = document.createElement('div'); // Создаем div для текста заголовка
        let selectTitleIcon = document.createElement('div'); // Создаем div для иконки заголовка

        // Если иконка не задана, используем иконку стрелки вниз по умолчанию
        if (this.icon === null) {
            this.icon = '<svg width="12" height="9" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.64637 6.0565L0.353478 1.7636C0.158216 1.56834 0.158216 1.25176 0.353478 1.0565L1.05686 0.353112C1.25193 0.158042 1.56814 0.157822 1.76348 0.352619L4.99992 3.58005L8.23637 0.352619C8.43171 0.157822 8.74792 0.158042 8.94299 0.353112L9.64637 1.0565C9.84163 1.25176 9.84163 1.56834 9.64637 1.7636L5.35348 6.0565C5.15822 6.25176 4.84163 6.25176 4.64637 6.0565Z" fill="currentColor"/></svg>';
        }

        // Добавляем классы для стилизации
        selectTitle.classList.add('select-title'); // Добавляем класс для обертки заголовка
        selectTitleText.classList.add('select-title__text'); // Добавляем класс для текста заголовка
        selectTitleIcon.classList.add('select-title__icon'); // Добавляем класс для иконки заголовка
        // Устанавливаем текст заголовка и иконку
        selectTitleText.textContent = selectedOption.textContent; // Устанавливаем текст заголовка из выбранной опции
        selectTitleIcon.innerHTML = this.icon; // Устанавливаем иконку заголовка

        // Добавляем текст и иконку к заголовку
        selectTitle.append(selectTitleText); // Добавляем текст заголовка в обертку
        selectTitle.append(selectTitleIcon); // Добавляем иконку заголовка в обертку

        if (selectedOption.value !== '') {
            customSelect.classList.add('active');
        }

        return selectTitle; // Возвращаем сформированный заголовок
    }


    /**
     * Создает контент для кастомного выпадающего списка.
     * @returns {HTMLElement} - HTML-элемент, представляющий контент кастомного выпадающего списка.
     */
    createCustomSelectContent() {
        // Создаем контейнер для содержимого выпадающего списка
        let selectContent = document.createElement('div');
        selectContent.classList.add('select-content');

        // Создаем обертку для опций и добавляем их
        let selectContentWrap = this.createCustomSelectOptions();
        selectContent.append(selectContentWrap);

        if (this.isMobile) {
            let overlay = document.createElement('div');
            overlay.classList.add('select-content_overlay');
            selectContent.append(overlay);
        }

        return selectContent;
    }

    /**
     * Создает обертку для опций кастомного выпадающего списка.
     * @returns {HTMLElement} - HTML-элемент, представляющий обертку для опций кастомного выпадающего списка.
     */
    createCustomSelectOptions() {
        // Создаем обертку для опций
        let selectContentWrap = document.createElement('div');
        selectContentWrap.classList.add('select-content_wrap');

        // Перебираем опции оригинального селекта и создаем для каждой опции метку
        this.options.forEach((option, index) => {
            // console.log(option)
            // Создаем элементы метки и радио-кнопки
            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');

            // Добавляем созданным элементам классы
            label.classList.add('select-content__wrapper');
            span.classList.add('select-content__radio');

            // Добавляем радио-кнопке атрибуты и устанавливаем ей тип и имя
            const optionAttributes = [...option.attributes];
            // Перебираем массив атрибутов `<option>`
            optionAttributes.map(attribute => {
                if (attribute.name !== 'selected') {
                    input.setAttribute(attribute.name, attribute.value);
                }

                if (attribute.name === 'disabled') {
                    label.classList.add('disabled');
                }
            });
            input.setAttribute('type', 'radio');
            input.setAttribute('name', this.select.name);

            // Устанавливаем текст метки
            span.textContent = option.textContent.trim();

            // Добавляем радио-кнопку и метку в обертку опций
            label.append(input);
            label.append(span);
            selectContentWrap.appendChild(label);
        });

        return selectContentWrap;
    }

    /**
     * Заменяет оригинальный выпадающий список кастомным.
     * @param {HTMLElement} select - HTML-элемент, представляющий кастомный выпадающий список.
     */
    replaceSelectWithCustom(select) {
        // Заменяем оригинальный выпадающий список кастомным
        this.select.replaceWith(select);

        this.options.forEach(option => {
            if (option.selected) {
                const value = option.value;
                const input = select.querySelector(`input[value="${value}"]`);

                input.checked = true;
                input.parentElement.click();
                console.log(input)
                console.log(input.checked)
            }
        })
    }

    /**
     * Назначает обработчики событий для кастомного выпадающего списка.
     * @param {HTMLElement} select - HTML-элемент, представляющий кастомный выпадающий список.
     */
    customSelectEvents(select) {
        // Находим заголовок и содержимое списка выбора в кастомном выпадающем списке
        let title = select.querySelector('.select-title');
        let titleText = select.querySelector('.select-title__text');
        let content = select.querySelector('.select-content');

        // Находим все метки в списке выбора
        let labels = content.querySelectorAll('.select-content__wrapper');
        let labelCount = labels.length;
        let labelHeight = 0;

        // Вычисляем высоту блока меток, которые будут показаны
        labels.forEach((label, index) => {
            if (index <= this.show) {
                labelHeight += label.offsetHeight;
            }

            // Добавляем обработчик события клика для каждой метки
            label.addEventListener('click', () => {
                // Получаем текст выбранной метки
                let labelText = label.querySelector('.select-content__radio').textContent;
                let input = label.querySelector('input');
                let inputValue = input.value;

                // делаем input выбранным
                input.checked = true;
                // Изменяем текст заголовка списка выбора
                titleText.textContent = labelText;
                // Закрываем список выбора
                select.classList.remove('open');

                if (this.isMobile) {
                    document.body.classList.remove('no-scroll');
                    document.querySelector('main').classList.remove('layer-up');
                }
                // добавляем класс, после первого выбора
                if (!select.classList.contains('active')) {
                    select.classList.add('active');
                }

                if (inputValue === '') {
                    select.classList.remove('active')
                } else {
                    title.classList.remove('validate')
                }
            });
        });

        // Если количество меток меньше или равно количеству меток, которые нужно показать,
        // то добавляем класс no-scroll для предотвращения прокрутки
        if (labelCount <= this.show) {
            content.classList.add('no-scroll');
        }

        // Устанавливаем максимальную высоту блока меток
        content.style.maxHeight = labelHeight + 32 + 'px';

        // Добавляем обработчик события клика для заголовка списка выбора
        title.addEventListener('click', () => {
            // Закрываем все открытые списки выбора
            document.querySelectorAll('.select').forEach(item => {
                if (item !== select) {
                    item.classList.remove('open');
                    if (this.isMobile) {
                        document.body.classList.remove('no-scroll');
                        document.querySelector('main').classList.remove('layer-up');
                    }
                }
            });

            // Открываем или закрываем список выбора
            select.classList.toggle('open');
            if (this.isMobile) {
                document.body.classList.toggle('no-scroll');
                document.querySelector('main').classList.toggle('layer-up');
            }
        });

        // Добавляем обработчик события клика вне кастомного выпадающего списка
        this.clickOutsideSelect(select, title);
    }

    /**
     * Обрабатывает событие клика вне кастомного выпадающего списка.
     * @param {HTMLElement} select - HTML-элемент, представляющий кастомный выпадающий список.
     * @param {HTMLElement} title - HTML-элемент, представляющий заголовок списка выбора.
     */
    clickOutsideSelect(select, title) {
        document.addEventListener('click', e => {
            let target = e.target;
            let itsEl = target == select || select.contains(target);
            let its_btn = target == title;
            let its_overlay = target.classList.contains('select-content_overlay')
            let its_el_is_open = select.classList.contains('open');

            // Закрываем выпадающий список, если произошел клик вне его области
            if (!itsEl && !its_btn && its_el_is_open) {
                select.classList.toggle('open');
                if (this.isMobile) {
                    document.body.classList.toggle('no-scroll');
                }
            }

            if (its_overlay && its_el_is_open) {
                select.classList.remove('open');
                if (this.isMobile) {
                    document.body.classList.remove('no-scroll');
                    document.querySelector('main').classList.remove('layer-up');
                }
            }
        });
    }

    /**
     * Заменяет кастомный выпадающий список на оригинальный.
     */
    replaceCustomWithDefault() {
        this.select.replaceWith(this.defaultSelect);
    }

    /**
     * Создает оригинальный выпадающий список.
     * @returns {HTMLSelectElement} - Созданный оригинальный выпадающий список.
     */
    createDefaultSelect() {
        // Получаем классы из кастомного селекта
        const customSelect = this.select;
        let selectClasses = Array.from(customSelect.classList);

        // Создаем элемент select
        let defaultSelect = document.createElement('select');

        // Получаем имя оригинального селекта
        let selectName = this.options[0].name;

        // Добавляем классы к созданному селекту
        selectClasses.forEach(className => defaultSelect.classList.add(className) );
        defaultSelect.classList.remove('active', 'custom-select', 'required');
        if (customSelect.classList.contains('required')) {
            defaultSelect.required = true;
        }

        // Устанавливаем имя оригинального селекта
        defaultSelect.name = selectName;

        // Добавляем остальные опции
        this.options.forEach(input => {
            defaultSelect.append(this.createDefaultOptions(input));
        });

        return defaultSelect;
    }

    /**
     * Создает опцию для оригинального выпадающего списка.
     * @param {HTMLInputElement} input - Элемент input из кастомного селекта.
     * @returns {HTMLOptionElement|boolean} - Созданная опция для оригинального выпадающего списка или false, если input не содержит значения.
     */
    createDefaultOptions(input) {
        // Проверяем, что значение input не пустое
        // Получаем атрибуты input
        const inputAttributes = [...input.attributes];

        // Создаем элемент option
        let option = document.createElement('option');

        // Получаем текстовое содержимое метки для этой опции
        let textContent = input.parentElement.querySelector('.select-content__radio').textContent.trim();

        // Устанавливаем атрибуты элемента option на основе атрибутов input
        inputAttributes.forEach(attribute => {
            let name = attribute.name;

            // Исключаем атрибуты 'type' и 'name'
            if (name !== 'type' && name !== 'name' && name !== 'checked') {
                option.setAttribute(name, attribute.value);
            }
        });
        console.log(input.checked)
        option.selected = input.checked;

        let optionClasses = Array.from(input.classList);
        optionClasses.forEach(className => option.classList.add(className));

        // Устанавливаем текстовое содержимое опции
        option.textContent = textContent;

        return option;
    }
}
