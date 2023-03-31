const table = document.querySelector("#utilisateurs");


/**
 * Fetch et actualise le tableau
 */
const get_users = () => fetch("/users")
    .then(res => res.json())
    .then(json => refreshTable());

/**
 * 
 * @param {User[]} users le tableau de la base de donnée 
 */
const refreshTable = users => {
    //clear tableau
    table.innerHTML = "";

    //parcours du tablau de users
    for (let user of users){
        let row = document.createElement("tr");
        row.innerHTML = `
        <td>${user.first}</td>
        <td>${user.last}</td>
        <td>${user.email}</td>
        <td>${user.company}</td>
        <td>${user.country}</td>
        <td>${user.created_at}</td>
        `;

        //ajoute une ligne à la table
        table.appendChild(row);
    }
};