let currentPage = 1;
let totalPages;
const listColors = document.getElementById("list-colors");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

function getUserInfo(page) {
  let requist = new XMLHttpRequest();

  requist.open("GET", `https://reqres.in/api/users?page=${page}`);

  requist.addEventListener("load", function () {
    let response = this.responseText;
    let responseDataJs = JSON.parse(response);
    totalPages = responseDataJs.total_pages;
    const fragment = document.createDocumentFragment();

    responseDataJs.data.forEach((element) => {
        let li = document.createElement("li");
        li.classList.add("li-item");
        // li.innerText = element.first_name + " " + element.last_name;

        let userInfoName = document.createElement("p");
        userInfoName.innerText = `${element.first_name} ${element.last_name}`;

        let imgElement = document.createElement("img");
        // imgElement.setAttribute('src', element.avatar);
        imgElement.src = `${element.avatar}`;

        imgElement.setAttribute("alt", "user-image");

        li.appendChild(userInfoName);
        li.appendChild(imgElement);

        fragment.appendChild(li);
    });

    document.getElementById("ul-item").innerHTML = " ";
    document.getElementById("ul-item").appendChild(fragment);
    updateButtons();
  });

  requist.addEventListener('error',function() {
    let pError = document.createElement('p');
    pError.textContent = 'Server Error';
    document.getElementById('userInfo').appendChild(pError);
  })

  requist.send();
}

async function getColors() {
    try {
        let hasMore = true;
        let currentPage = 1;

        while (hasMore) {
            const result = await fetch(`https://reqres.in/api/unknown?page=${currentPage}`);

            if (result.status === 200) {
                const data = await result.json();
                currentPage = data.page;
                const totalPages = data.total_pages;
                hasMore = currentPage !== totalPages;
                const colors = data.data;

                for (const color of colors) {
                  const colorName = color.name;
                  const colorHex = color.color;
                  const li = document.createElement("li");
                  li.id = color.id;
                  li.innerHTML = colorName;
                  li.style.color = colorHex;
                  li.style.fontSize = "20px";
                  li.style.fontWeight = 700;
                  listColors.appendChild(li);
                }

                if (hasMore) {
                  currentPage++;
                }
            } else {
              hasMore = false;
            }
        }
    } catch (e) {
        console.log(e);
    }
}

function updateButtons() {
  if (currentPage === 1) {
    prevButton.setAttribute("disabled", true);
  } else {
    prevButton.removeAttribute("disabled");
  }

  if (currentPage === totalPages) {
    nextButton.setAttribute("disabled", true);
  } else {
    nextButton.removeAttribute("disabled");
  }
}

prevButton.addEventListener("click", function () {
    currentPage -= 1;
    if (currentPage === 1) {
    } else {

    }
    getUserInfo(currentPage);
});

nextButton.addEventListener("click", function () {
    currentPage += 1;
    getUserInfo(currentPage);
});

getUserInfo(currentPage);
getColors();
updateButtons();
