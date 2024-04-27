let timeoutId;
let newsCounter = 0;
let limit = true;
let visibleData = [];
let tags = [];
let selectedTags = [];
let searchText = '';

const sortByDate = (data) => {
    return data.map(ele => ({
        ...ele,
        Time: parseDate(ele.dateAndTime)
    })).sort((a, b) => new Date(b.Time) - new Date(a.Time));
}

function parseDate(dateString) {
    const [date, time] = dateString.split(", ");
    const [day, month, year] = date.split("/");
    const [hours, minutes, seconds] = time.split(":");
    return new Date(`${year}-${padZero(month)}-${padZero(day)}T${hours}:${minutes}:${seconds}`);
}

function padZero(value) {
    return value.toString().padStart(2, "0");
}



const convertTime = (dateAndTime) => {
    let date = dateAndTime.split(",")[0];
    let time = dateAndTime.split(",")[1];
    let hours = time.split(":")[0];
    let minutes = time.split(":")[1];
    if(hours > 12){
        hours -= 12;
        return `${date}, ${hours < 10 ? "0"+hours : hours}:${minutes} PM`;
    }
    return `${date}, ${hours}:${minutes} AM`;
}


const feedNews = ({ title, content, dateAndTime, visible  }) => {
    console.log(visible);
    if (visible === false) 
        return
    const newNewsCard = document.createElement("div");
    newNewsCard.classList.add("news-card");
    if(newsCounter === 0)
        newNewsCard.classList.add("full-width");
    
    newNewsCard.innerHTML = `
        <h2 class="heading">${title}</h2>
        <p class="date">${convertTime(dateAndTime)}</p>
        <p class="content">${content}</p>
    `;
    newsCounter++;
    return newNewsCard;
}


const loadNews = () => {
    newsCounter = 0;
    const newsBody = document.querySelector("main");
    newsBody.innerHTML = "";
    visibleData = visibleData.filter(ele => ele.visible === true);
    visibleData = sortByDate(visibleData);
    console.log(visibleData);
    if(visibleData.length === 0){
        let noResultEle = document.createElement("h1");
        noResultEle.textContent = "No results found :("

        newsBody.appendChild(noResultEle);
    }
    for( ele of visibleData ){
        if(newsCounter >= 7 && limit)
            break;
        let news = feedNews(ele);
        newsBody.appendChild(news);
    }
}

function removeLimit(){
    newsCounter = 0;
    limit = false;
    loadNews();
    document.querySelector("footer button").setAttribute("hidden","true")
}
function addLimit() {
    newsCounter = 0;
    limit = true;
    document.querySelector("footer button").removeAttribute("hidden");
    loadNews();
}


const addDataVisibility = (data) => {
    return data.map(element => {
        element.visible = true;
        return element;
    });
}

const filterDataSearch = (searchText) => {
    limit = true;
    newsCounter = 0;
    // console.log(data);
    // console.log(data.length);
    const allButton = document.querySelector(".catogiries").children[0];
    allButton.setAttribute("style", "background-color: black; color: white");
    const buttons = document.querySelectorAll(".tag-btn");
    Array.from(buttons, ele => ele.setAttribute("style", "background-color: #e0e0e0; color: black"));
    visibleData = data.map(element => {
        if(element.title.toLowerCase().includes(searchText)){
            visible = true;
        }
        else{
            visible = false;
        }
        return {...element, visible};
    });
    visibleData = visibleData.map(element => {
        indexOfWord = element.title.toLowerCase().indexOf(searchText)
        element.title = `${element.title.substring(0, indexOfWord)}<span>${element.title.substring(indexOfWord, indexOfWord + searchText.length)}</span>${element.title.substring(indexOfWord + searchText.length)}`
        return element
    })
    loadNews();
}

const featureSearch = () => {
    const search = document.querySelector("#search-field")
    search.addEventListener("keyup", (e) => {
        searchText = e.target.value.toLowerCase();
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            document.querySelector("main").innerHTML = ""
            filterDataSearch(searchText);
        }, 1500);
    });
};

const addTagButtons = () => {
    data.forEach(element => {
        if (!tags.includes(element.category)) {
            tags.push(element.category);
        }
    });
    catogiriesDiv = document.querySelector(".catogiries");
    tags.forEach(tag => {
        let newButton = document.createElement("button");
        newButton.value =  tag;
        newButton.innerHTML = tag[0].toUpperCase()+tag.substring(1);
        newButton.setAttribute("class", "tag-btn");
        catogiriesDiv.appendChild(newButton);
    });
};
const allButtonExe = () => {
    const allButton = document.querySelector(".catogiries").children[0];

    allButton.addEventListener("click", () => {
        allButton.setAttribute("style", "background-color: black; color: white");
        const buttons = document.querySelectorAll(".tag-btn");
        Array.from(buttons, ele => ele.setAttribute("style", "background-color: #e0e0e0; color: black"));
        selectedTags = [];
        visibleData = data.map(element => {
            if (tags.includes(element.category)){
                visible = true;
            }
            else {
                visible = false;
            }
            return { ...element, visible };
        });
        addLimit();
    })
}
const tagButtonsExe = () => {
    const buttonClass = document.querySelectorAll(".tag-btn");
    Array.from(buttonClass, ele => ele.addEventListener("click", () => {
        document.querySelector("#all-news").setAttribute("style", "background-color: #e0e0e0; color: black");
        const value = ele.getAttribute("value");
        console.log(value);
        if (selectedTags.includes(value)) {
            selectedTags = selectedTags.filter(tag => tag !== value); 
            ele.setAttribute("style", "background-color: #e0e0e0; color: black");
        } else {
            selectedTags.push(value);
            ele.setAttribute("style", "background-color: black; color: white");
        }
        visibleData = data.map(element => {
            if (selectedTags.includes(element.category)) {
                visible = true;
            }
            else {
                visible = false;
            }
            return { ...element, visible };
        });
        addLimit();
    }));
}




function onload(){
    visibleData = addDataVisibility(data);
    loadNews();
    featureSearch();
    addTagButtons();
    allButtonExe();
    tagButtonsExe();
}
onload()






