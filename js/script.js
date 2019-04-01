// IDEA: add boolean third parameter to Item constructor to keep track of starred entries

class Item {
    constructor(title, type){
        this.title = title;
        this.type = type;
    }
}

class UI {
    static displayItems(){
        const items = Store.getItems();
        items.forEach((item) => UI.addItemToTable(item));
    }

    static addItemToTable(item){
        const list = document.getElementById('list');
        const row = document.createElement('tr');

        // create new row for new item instance
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>
                <a href="#"><i class="fas fa-trash mr-sm-3 delete"></i></a>
                <a href="#"><i class="fas fa-star mr-sm-3"></i></a>
            </td>
        `;
        list.appendChild(row);
    }

    static deleteItem(el){
        if (el.classList.contains('delete')){
            // 1. parent = anchor, 2. parent = table cell, 3. parent = table row
            el.parentElement.parentElement.parentElement.remove();
        }
    }

    // static resetForm(){
    //     document.form[0].reset;
    // }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.getElementById('watchlist');
        // IDEA: make tooltips on the side instead
        container.insertBefore(div, form);

        // make div disappear after some time
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearInput(){
        document.getElementById('title').value = '';
    }

    // star highlights the table row
    // FIXME: use AJAX to save changes
    static starEntry(el){
        el.classList.add('starred');
    }
}

class Store {
    static getItems(){
        let items;
        if (localStorage.getItem('items') === null){
            items = [];
        } else {
            // can't store objects in local storage, only strings, hence JSON methods
            items = JSON.parse(localStorage.getItem('items'));
        }
        return items;
    }

    static addItem(item){
        const items = Store.getItems();
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }

    static removeItem(title){
        const items = Store.getItems();
        items.forEach((item, index) => {
            if (item.title === title){
                items.splice(index, 1);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    }
}

// make radio options unchecked on page load
document.addEventListener('DOMContentLoaded', function(){
    let radioInput = document.querySelectorAll('.radio input');
    for (var i = 0; i < radioInput.length; i++){
        radioInput[i].checked = false;
    }
});


// make radio inputs appear only if title tet field is not empty
var toggleRadio = function() {
        let radio = document.querySelector('.radio');
        radio.classList.toggle('revealed');
}

var isEmpty = true;
var title = document.getElementById('title');
title.addEventListener('keyup', function(){
    if (title.value === '' && isEmpty === false){
        // prevent toggle if there are already characters in input field
        toggleRadio();
        isEmpty = true;
        // prevent toggle if input field is already empty
      } else if (title.value !== '' && isEmpty === true){
        toggleRadio();
        isEmpty = false;
      }
})

// make submit btn active only after a radio option is checked
var radioChecked = false;
var radioParent = document.querySelector('.radio');
radioParent.addEventListener('click', isRadioChecked, false);
function isRadioChecked(e){
    var submitBtn = document.getElementById('submit');
    if (e.target !== e.currentTarget) {
      e.stopPropagation;
      submitBtn.classList.remove('disabled');
      radioChecked = true;
    }
}

document.querySelector('#list').addEventListener('click', (e) => {
    // remove from UI
    UI.deleteItem(e.target);

    // remove from localStorage
    Store.removeItem(e.target.parentElement.parentElement.parentElement.firstElementChild.textContent);

    if (e.target.classList.contains('fa-trash')){
        UI.showAlert('Deleted', 'danger');
    } else if (e.target.classList.contains('fa-star')){
        // added to favourites/starred
        UI.starEntry(e.target.parentElement.parentElement.parentElement);
        UI.showAlert('Favourited', 'info');
    }
});

document.addEventListener('DOMContentLoaded', UI.displayItems);
document.getElementById('watchlist').addEventListener('submit', (e) => {
    // prevent submit
    e.preventDefault();

    // get form values
    const title = document.getElementById('title').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    // make new instance
    const item = new Item(title, type);

    // add item to UI
    UI.addItemToTable(item);

    // add item to store
    Store.addItem(item);

    // succesfully saved entry
    UI.showAlert('Saved', 'success');
});
