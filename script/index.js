const showLoader = () => {
    document.getElementById('loader').classList.remove('hidden')
    document.getElementById('lessonsContainer').classList.add('hidden')
}
const hideLoader = () => {
    document.getElementById('loader').classList.add('hidden')
    document.getElementById('lessonsContainer').classList.remove('hidden')
}

document.getElementById('main-section').style.display = 'none'
document.getElementById('nav-bar').style.display = 'none'

document.getElementById('login-btn').addEventListener('click', function(){
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    if(!name){
        alert('Please Tell use your Name first');
        return
    }
    if(password !== '123456'){
        alert('Wrong password.Contact admin to get your Login Code')
        return
    }
    
    document.getElementById('nav-bar').style.display = 'block'
    document.getElementById('main-section').style.display = 'block'
    document.getElementById('hero-section').style.display = 'none'
    document.getElementById('footer-section').style.display = 'none'

    Swal.fire({
        title: "login successfully!",
        icon: "success",
        draggable: true,
        
      });
})
// logout-btn
document.getElementById('logout-btn').addEventListener('click', function(){

    Swal.fire({
        title: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#422AD5',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!'
      })
      .then((result) => {
        if(result.isConfirmed) {
            
        document.getElementById('nav-bar').style.display = 'none'
        document.getElementById('main-section').style.display = 'none'
        document.getElementById('hero-section').style.display = 'block'
        document.getElementById('hero-section').style.display = 'flex'
        document.getElementById('footer-section').style.display = 'block'

        Swal.fire({
            icon: 'success',
            title: 'Logged out!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
})

function removeActiveClass(){
    const activeBtn = document.getElementsByClassName('active');
    for(let btn of activeBtn){
        btn.classList.remove('active');
    }
};

const loadCategories= () =>{
    fetch('https://openapi.programming-hero.com/api/levels/all')
    .then((res) => res.json())
    .then((data) => {
        displayLEssonBtn(data.data);
        
    })
}

function displayLEssonBtn (lessons){

    const lessonsContainer = document.getElementById('lessons-container');
    lessonsContainer.innerHTML = ''

    for(let lesson of lessons){
        // console.log(lesson)
        const button = document.createElement('button')
        button.innerHTML = `
        <button onclick = "displayByLevels('${lesson.level_no}')" class="text-sm text-[#422AD5] cursor-pointer 
        hover:text-white border-[#422AD5] hover:bg-[#422AD5]  rounded-md px-2 py-1 border">
        <i class="fa-solid fa-book-open"></i> 
        Lesson -${lesson.level_no} 
        </button>
        `;

        // -----
        button.querySelector('button').addEventListener('click', () => {
            removeActiveClass();
            button.querySelector('button').classList.add('active');
            displayByLevels(lesson.level_no)
        })
        lessonsContainer.append(button);
        
    }
}


const displayByLevels = async(level_no) => {
    showLoader()
    const response = await fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
    const data = await response.json();
    // console.log(data)

    displayLessons(data.data)
    
    hideLoader()
}

// lesson details
const displayLessons = (lessons) => {
    // console.log(lessons)
    showLoader()

    const lessonsContainer = document.getElementById('lessonsContainer')
    lessonsContainer.innerHTML = "";

    if(lessons.length < 1){
        // console.log('no data')
        
        lessonsContainer.innerHTML = `
        <div id="" class="text-center py-14 col-span-3">
                <img class="max-w-fit mx-auto mb-10" src="assets/alert-error.png" alt="">
                <p class="hind-siliguri text-gray-500 mb-3">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h1 class="hind-siliguri text-3xl font-semibold">নেক্সট Lesson এ যান</h1>
            </div>
        `
        hideLoader()
    }
    else{

    const gridContainer = document.createElement('div');
    gridContainer.className = "grid lg:grid-cols-3 md:grid-cols-2  grid-cols-1 gap-5 py-5 px-5"

    lessons.forEach((lesson) => {
        // console.log(lesson)
        const meaningPronunciation = lesson.meaning === null ? "অর্থ নেই" : lesson.meaning
        
        const div = document.createElement('div');
        div.innerHTML = `
                    <div class="hover:border hover:border-[#EDF7FF] hover:shadow-md px-5 py-10 rounded-lg drop-shadow-sm bg-white ">
                        <div class=" items-center text-center">
                          <h2 class="text-xl font-semibold">${lesson.word} </h2>
                          <p>Meaning /Pronounciation</p>
                          <h1 class="text-2xl mt-3 font-semibold text-[#18181B] hind-siliguri">
                            "${meaningPronunciation} / ${lesson.pronunciation}"</h1>

                        </div>
                        <div class="flex justify-between px-10 mt-9">
                            <i id="${lesson.id}" class="fa-solid fa-circle-info bg-[#1A91FF10] px-2 py-2 rounded-md hpver hover:text-[#422AD5] cursor-pointer"></i>
                            <i id="${lesson.id}" class="fa-solid fa-volume-high bg-[#1A91FF10] px-2 py-2 rounded-md hpver hover:text-[#422AD5] cursor-pointer"></i>
                          </div>
                    </div>
        `;
        gridContainer.appendChild(div)
    });
    lessonsContainer.appendChild(gridContainer);
  }
  hideLoader()
// -----------
      lessonsContainer.addEventListener('click', (event) => {
        if(event.target.classList.contains('fa-circle-info')){
            const wordId = event.target.id;
            displayWordDetails(wordId)
        }
        
    })
    
};


//Click to play ++++++++++++++
lessonsContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains('fa-volume-high')){
        const wordId = event.target.id;
        playSound(wordId)
    }
    
})
const playSound = (id) =>{
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then(res => res.json())
    .then(data => pronounceWord(data.data.word))
}
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    console.log(utterance)
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
  }
// ++++++++++++++

// word details in modal
const displayWordDetails = (id) =>{
    fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then(res => res.json())
    .then(data => displayDetails(data.data))
}

const displayDetails = (details) => {
    const modalContent = document.getElementById('modal-content')
    // console.log(modalContent)
    modalContent.innerHTML = `
        <h3 class="text-lg font-bold">${details.word} (<i class="fa-solid fa-microphone"></i> : ${details.pronunciation})</h3>
        <p class="py-1 font-bold">Meaning</p>
        <p class = "mb-2">${details.meaning ? details.meaning : "অর্থ পাওয়া যায়নি"}</p>
        
        <p class="py-1 font-bold">Example</p>
        <p class = "pb-2">${details.sentence}</p>

        <p class="py-1 font-bold">সমার্থক শব্দ গুলো</p>
        <div class = "synonyms-list pb-2" id="synonyms">
        
        </div>
    `;

    const synonymsDiv = modalContent.querySelector('.synonyms-list');
    if(details.synonyms && details.synonyms.length > 0){
        // synonymsDiv.textContent = 'অর্থ পাওয়া যায়নি';

        details.synonyms.forEach(synonym => {
            const synonymSpan = document.createElement('span');
            synonymSpan.textContent = synonym;
            synonymSpan.classList.add('synonym-item');
            synonymsDiv.appendChild(synonymSpan);
        })
    }
    else{
        synonymsDiv.textContent = ' '
    }

    wordDetail.showModal()
};



    

// displayWordDetails(1)
displayByLevels('1')
loadCategories()


document.getElementById('lessons-container')
.addEventListener('click', function(event){
        event.preventDefault()
        
        if(this.click){
            document.getElementById('lessonsContainer').style.display= 'block'
            document.getElementById('select-lesson').style.display= 'none'
        }
    })
    document.getElementById('lessonsContainer').style.display= 'none'


    // sound ______------

 
