const items = document.querySelectorAll('[data-item]');
const selected = document.querySelectorAll('.item__summary');
const options = document.querySelectorAll('.item__option');
const deleteButtons = document.querySelectorAll('.service__delete');

let obj = {}
items.forEach(item => {
    const input = item.querySelector('.switch__input');
    const select = item.querySelector('.item__select');
    if(select) {
        obj[item.dataset.item] = {checked: input.checked, select: select.querySelector('.selected').dataset.block};
    } else {
         obj[item.dataset.item] = {checked: input.checked}
    }
})

 console.log(obj)

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