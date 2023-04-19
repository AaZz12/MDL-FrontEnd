
const table = document.querySelector("#users");
const USER_URL = 'http://localhost:3000/users';
const form = document.querySelector("form");

const user_checker = {
    first: /^[A-Za-z-]+$/, //prénom
    last: /^[A-Za-z-]+$/, //nom
    email: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,4}$/, //email
    company: /^[A-Za-z- ]+$/, //entreprise
    country: /^[A-Za-z- ]+$/ //pays
};

const keys = ["first", "last", "email", "company", "country"];

//variable globale pour stocker l'utilisateur en cours d'édition
let current_user;

const get_users = () => fetch(USER_URL).then(res => res.json()).then(json => refreshTable(json));

/**a
 * 
 * @param {User[]} users le tableau de la base de donnée 
 */
const refreshTable = users => {
    //clear tableau
    table.innerHTML = "";

    //parcours du tablau de users
    for (let user of users) {
        let row = document.createElement("tr");
        row.id = "user-" + user.id;

        row.innerHTML = `
        <td>${user.first}</td>
        <td>${user.last}</td>
        <td>${user.email}</td>
        <td>${user.company}</td>
        <td>${user.country}</td>
        <td>${user.created_at}</td>
        <td><img onclick="start_edit(${user.id})" src="edit.svg"/></td>
        <td><img onclick="delete_user(${user.id})" src="delete.svg"/></td>


        `;

        //ajoute une ligne à la table
        table.appendChild(row);
    }
};

form.addEventListener("submit", event => {
    let rawdata = new FormData(form);
    let data = {};

    rawdata.forEach((value, key) => {
        if (value.match(user_checker[key]) == null) {
            document.getElementById("error").innerHTML = "vérifiez les infos rentrées";
            event.preventDefault();
            return;
        }

        data[key] = value;
    });

    //on vide le formulaire
    for (let input of document.querySelectorAll("form input:not([type='submit'])")) {
        input.value = "";
    }
    event.preventDefault();
    return add_user(data);
});

/** 
 * add user in bdd
 * @param {user} user the user to add 
 * @returns 
 */
const add_user = user => fetch(USER_URL, {
    method: "post",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
}).then(get_users);

/**
 * 
 * @param {number} id the id to edit
 */
const start_edit = id => {
    let row = document.getElementById("user-" + id);
    let row_data = row.children;

    current_user = { id: id };

    for (let i = 0; i < keys.length; i++) {
        current_user[keys[i]] = row_data[i].innerHTML;
        row_data[i].innerHTML = `<input type="text" value="${current_user[keys[i]]}">`;
    }

    row_data[6].innerHTML = `<img onclick="edit_user()" src="done.svg"/>`;
    row_data[7].innerHTML = `<img onclick="cancel_edit()" src="cancel.svg"/>`;

};

/**
 * cancel edit
 */
const cancel_edit = () => {
    let row = document.getElementById("user-" + current_user.id);
    let row_data = row.children;

    for (let i = 0; i < keys.length; i++) {
        row_data[i].innerHTML = current_user[keys[i]];
    }

    row_data[6].innerHTML = `<img onclick="start_edit(${current_user.id})" src="edit.svg"/>`;
    row_data[7].innerHTML = `<img onclick="delete_user(${current_user.id})" src="delete.svg"/>`;
};

/**
 * edit user dans la bdd
 */
const edit_user = () => {
    let new_user = {};
    let row = document.getElementById("user-" + current_user.id);
    let row_data = row.children;

    for (let i = 0; i < keys.length; i++) {
        if (row_data[i].firstChild.value.match(user_checker[keys[i]]) == null) {
            alert("Erreur, vérifiez les informations");
            return cancel_edit();
        }
        new_user[keys[i]] = row_data[i].firstChild.value;
    }

    fetch(USER_URL, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: current_user.id,
            to_edit: new_user
        })
    }).then(get_users);
};

const delete_user = id => fetch(USER_URL, {
    method: "delete",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        id: id
    })
}).then(get_users);


get_users();