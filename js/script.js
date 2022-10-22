const block = document.querySelector('.content');
const popUp = document.querySelector('.popUp');
let newObj = {};

const customSelect = `<div class="item__select">
                        <div class="item__summary">Мгновенно</div>
                        <div class="item__block">
                            <div class="item__options">
                                <div class="item__option selected" data-block="Мгновенно">Мгновенно</div>
                                <div class="item__option" data-block="1 раз в день">1 раз в день</div>
                                <div class="item__option" data-block="Отключить">Отключить</div>
                            </div>
                        </div>
                    </div>`

const getData = async () => {
       return  await fetch('./js/data.json')
                .then(res => res.json())
                .then(data => data)
                .catch(error => console.log(error))
    }

const createDOM = async () => {
    let result = await getData();
    newObj = JSON.parse(JSON.stringify(result));
    console.log(newObj);
    let template = '';

    const createArticle = (title, checked, select, tip, note) => {
       let article  = `<article class="section__item item" data-item="${title}">
                            <div class="item__header">
                                ${tip 
                                    ? `<div class="item__flex">
                                            <h4 class="item__title">${title}</h4>
                                            <div class="item__info">
                                                <div class="info__icon">
                                                    <p class="info__text">${tip}</p>
                                                </div>
                                            </div>
                                        </div>`
                                    : `<h4 class="item__title">${title}</h4>`}
                            </div>
                            <label class="item__switch">
                                <input type="checkbox" class="switch__input" ${checked && "checked"}>
                                <span class="switch__slider"></span>
                            </label>
                            <div class="item__add">
                                ${note ? `<p class="item__note">${note}</p>` : ''}
                                ${select ? customSelect : ''}
                            </div>
                        </article>`;
        return article;
    }

    const entries = Object.entries(result);

    entries.forEach(([key, value]) => {
        template += ` <section class="section">
                        <h2 class="section__title">${key}</h2>
                        <div class="section__block">`;
        value.forEach(el => {
            if(key === "Уведомление по Сайтам") {
                if(el.title) {
                    const {title, checked, select, tip, note} = el;
                    template += createArticle(title, checked, select, tip, note);
                } else {
                    Object.entries(el).forEach(([key, value]) => {
                       template += `<h3  class="section__subtitle">${key}</h3>
                                         <div class="section__block">`
                       value.forEach(el => {
                             if(el.blocks) {
                                 template += `<article class="section__item "  data-item="${el.title}">
                                        <h4 class="item__title">${el.title}</h4>
                                        <div class="item flex-align">
                                            <div class="item__service service">
                                                <div class="service__list">`
                                    if(el.blocks.length) {
                                        el.blocks.forEach(block => {
                                        template += `<div class="service__block">
                                                            <p class="service__title">${block}</p>
                                                            <div class="service__delete">✕</div>
                                                        </div>`
                                        })
                                     } else {template += `<div class="service__block" data-add>
                                                    <p class="service__title">${el.title}: Не обнаружен</p>
                                                    <div class="service__delete">✕</div>
                                                </div>`
                                    }  
                                    template += `</div>
                                                <div class="service__details" onclick="openDetailsModal()">Детали</div>
                                                </div>
                                                <label class="item__switch">
                                                    <input type="checkbox" class="switch__input" ${el.checked && "checked"}>
                                                    <span class="switch__slider"></span>
                                                </label>
                                                <div class="item__add">
                                                    ${el.note ? `<p class="item__note">${el.note}</p>` : ''}
                                                    ${el.select ? customSelect : ''}
                                                </div>
                                            </div>
                                        </article>`                    
                               } else {
                                 template += createArticle(el.title, el.checked, el.select, el.tip, el.note);
                            }
                       })
                       template +='</div>'
                    })
                }
        } else {
            const {title, checked, select, tip, note} = el;
            template += createArticle(title, checked, select, tip, note);
            }
        })
        template += '</div></section>';
        block.innerHTML = template;  
    })
}

const createPage = async () => {
    await createDOM();
    const selected = document.querySelectorAll('.item__summary');
    const options = document.querySelectorAll('.item__option');
    const deleteButtons = document.querySelectorAll('.service__delete');
    const items = document.querySelectorAll('[data-item]');
    
    selected.forEach(el => el.addEventListener('click', ({target}) => target.parentElement.classList.toggle('active')));

    options.forEach(el => {
        el.addEventListener('click', ({target}) => {
                    const parent = target.closest('.item__select');
                    if(!target.matches('.selected')) {
                        const optionsArr = parent.querySelectorAll('.item__option');
                        const header = parent.querySelector('.item__summary');
                        optionsArr.forEach(el => el.classList.remove('selected'));
                        target.classList.add('selected');
                        header.innerText = target.innerText;
                        parent.classList.remove('active');
                    }
                })
            }
        );

    deleteButtons.forEach(el => el.addEventListener('click', ({target}) => {
            const parent = target.closest('.section__item');
            const title = parent.querySelector('.item__title');
            const serviceList = parent.querySelector('.service__list');
            let count = 0;
            
            target.parentElement.style.display = 'none';
            for (let i = 0; i < serviceList.children.length; i++) {
                serviceList.children[i].style.display === 'none' && count++; 
            }
            if (count === serviceList.children.length) {
                serviceList.innerHTML += `<div class="service__block" data-add>
                                                <p class="service__title">${title.innerText}: Не обнаружен</p>
                                                <div class="service__delete">✕</div>
                                            </div>`
            }
        }
    ));
}

createPage();

////POP UP
    const disableScroll = () => {
        const widthScroll = window.innerWidth - document.body.offsetWidth;
        document.body.dbScrollY = window.scrollY;
        document.body.style.cssText = `
                position: fixed;
                top: ${-window.scrollY}px;
                left: 0;
                width: 100%;
                height: 100vh;
                overflow: hidden;
                padding-right: ${widthScroll}px;
                `
    }

    const enableScroll = () => {
        document.body.style.cssText = '';
        window.scroll({
            top: document.body.dbScrollY,
        })
    }

    const closeWindow = () => {
        popUp.classList.remove('active');
        popUp.innerHTML = '';
        enableScroll();
    }

    const openDetailsModal = () => {
        let template = `
                <div class="popUp__bg">
                    <div class="popUp__block">
                        <div class="popUp__close" onclick="closeWindow()">&#10006;</div>
                            <div class="popUp__content">
                                <p class="popUp__text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt quam convallis a lacus consequat, ultrices. </p>
                            </div>
                        </div>
                    </div>
                </div>`;
        popUp.classList.add('active');
        popUp.innerHTML = template;
        disableScroll();
    }

    const openConfirmModal = () => {
        let template = `
                <div class="popUp__bg">
                    <div class="popUp__block">
                        <div class="popUp__close" onclick="closeWindow()">&#10006;</div>
                            <div class="popUp__content">
                                <p class="popUp__title">Ваши данные успешно сохранены!</p>
                                <div class="popUp__icon">
                                        <img src="../images/ok.svg">
                                </div>
                               </div>
                        </div>
                    </div>
                </div>`;
        popUp.innerHTML = template;
    }
    const openSaveModal = () => {
        let template = `
                <div class="popUp__bg">
                    <div class="popUp__block">
                        <div class="popUp__close" onclick="closeWindow()">&#10006;</div>
                            <div class="popUp__content">
                                <p class="popUp__title">Вы уверены?</p>
                                    <div class="popUp__buttons">
                                        <div class="section__button popUp-btn" onclick="closeWindow()">Нет</div>
                                        <div class="section__button section__button-blue popUp-btn" onclick="openConfirmModal()">Да</div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        popUp.classList.add('active');
        popUp.innerHTML = template;
        disableScroll();
    }

popUp.addEventListener('click', ({target}) => {
    if(target.matches('.popUp__close') || target.matches('.popUp__bg')) {
        closeWindow();
    }
})
