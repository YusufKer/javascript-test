const customersTable = document.querySelector("#customers-table");
const searchInput = document.querySelector("#search");
let customers;
let html = '';
let today = new Date;

async function fetchCustomers(){
    try{
        const response = await fetch("./data.json");
        const data = await response.json();
        return data; 
    }catch(e){
        console.log({message:"request failed",error:e});
    }
}

async function buildHtml(){
    try{
        customers = await fetchCustomers();
        customers.forEach(customer =>{
            html += `
                <tr>
                    <td class="name">${customer.name}</td>
                    <td class="age" data-age='${age(customer.birthdate)}'>${customer.birthdate}</td>
                </tr>
            `
        })
    }catch(e){
        console.log({message:"request failed",error:e});
    }
}

function age(birthday){

    const year = birthday.split("-")[0];
    const month = birthday.split("-")[1];
    const day = birthday.split("-")[2];

    const birthday_date = new Date(year,month,day);
    const today = new Date();
    const age =  today.getFullYear() - birthday_date.getFullYear();

    return age;
}

async function inject(){
    await buildHtml();
    customersTable.innerHTML = html;
}
inject();

searchInput.addEventListener("keyup", (e) =>{
    let names = document.querySelectorAll("td.name");
    const hasNumber = /[0-9]/;
    const hasText = /[a-z]/i;
    if(hasNumber.test(e.target.value)){
        let seperateQueries = e.target.value.split(" ");
        console.log({seperateQueries})
        let ageQuery = seperateQueries.filter(query => query.includes("-"));
        console.log({ageQuery});
        if(ageQuery.length > 0){
            const lowerAge = ageQuery[0].split("-")[0];
            const higherAge = ageQuery[0].split("-")[1];
            names.forEach(name =>{
                const age = name.nextElementSibling.dataset.age;
                if(age >= lowerAge && age <= higherAge){
                    name.parentElement.style.display = "block";
                }else{
                    name.parentElement.style.display = "none";
                }
            })
        }
    }
    if(hasText.test(e.target.value)){
        console.log("We have text...")
        let textQuery = e.target.value.replace(/[0-9]/g,"");
        textQuery = textQuery.replace(/-/g,"");
        textQuery = textQuery.replace(/ /g,"");
        names = Array.from(names).filter(name => name.parentElement.style.display == "block");
        names.forEach(name =>{
            if(name.innerText.toLowerCase().includes(textQuery.toLowerCase())){
                name.parentElement.style.display = "block";
            }else{
                name.parentElement.style.display = "none";
            }
        })
    }
})