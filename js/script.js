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

        // successfully removed entry
        UI.showAlert('Deleted', 'danger');
    }

    // static clearInput(){
    //     document.querySelector('title').value = '';
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
}

class Store {
    static getItems(){
        let items;
        if (localStorage.getItem('items') === null){
            items = [];
        } else {
            // can't store objects in local storage, only strings, that's why we need JSON methods
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
            if (book.title === title){
                items.splice(index, 1);
            }
        });
        localStorage.setItem('items', JSON.stringify(items));
    }
}

document.addEventListener('DOMContentLoaded', UI.displayItems);
document.getElementById('watchlist').addEventListener('submit', (e) => {
    // prevent submit
    e.preventDefault();

    // get form values
    const title = document.getElementById('title').value;
    const type = document.querySelector('input[name="type"]:checked').value;

    // validate
    if (title === ''){
        showAlert('Title is empty', 'danger');
    } else {
      // make new instance
      const item = new Item(title, type);

      // add item to UI
      UI.addItemToTable(item);

      // add item to store
      Store.addItem(item);

      // succesfully saved entry
      UI.showAlert('Saved', 'success');
    }

    // clear field
    // UI.clearInput();
});

// enable Add btn
// addeventlistener on title
// if both title is not empty and a button from btn-group has been pressed, enable ADD
var radioParent = document.querySelector('.radio');
var submitBtn = document.getElementById('submit');
radioParent.addEventListener('click', getRadioValue, false);
function getRadioValue(e){
    if (e.target !== e.currentTarget) {
      submitBtn.classList.remove('disabled');
      e.stopPropagation;
    }
}

document.getElementById('list').addEventListener('click', (e) => {
    // remove from UI
    UI.deleteItem(e.target);

});
