let rowData = $('#rowData');
let fullLoader = $('.loading');
let loader = $('.inner-loading');
$(document).ready(() => {
    fullLoader.fadeOut(1000);
});

const sideNavContentWidth = $('.nav-content').outerWidth();
$('.side-nav').animate({left: -sideNavContentWidth},0)
$('.nav-content li').animate({top:500}, 500)

$('.side-nav i.open-close-icon').on('click',()=>{

    if ($('.side-nav').css('left') == '0px') {
        $('.side-nav').animate({left: -sideNavContentWidth},1000)
        $('.open-close-icon').addClass('fa-bars')
        $('.open-close-icon').removeClass('fa-x')

        let len = $('.nav-content li').length;
        for (let i = len -1 ; i >= 0 ; i--) {
            $('.nav-content li').eq(i).stop(true).animate({ top: 500 }, (len - i) * 300);
        } 
    }
    else{
        $('.side-nav').animate({left: 0},1000)
        $('.open-close-icon').removeClass('fa-bars')
        $('.open-close-icon').addClass('fa-x')

        for (let i = 0; i < $('.nav-content li').length; i++) {
            $('.nav-content li').eq(i).stop(true).animate({top:0}, (i+1)* 400)
        }   
    }
})

$(document).ready(function () {
    const rowDataOffset = rowData.offset().top;

    $(window).on('scroll', function () {
        if ($(window).scrollTop() > rowDataOffset) {
            $('.scrollToTop').addClass('visible');
        } else {
            $('.scrollToTop').removeClass('visible');
        }
    });

    $('.scrollToTop').on('click', function () {
        $('html, body').css('scroll-behavior', 'auto');
        $('html, body').animate({ scrollTop: 0 }, 500, function() {
        $('html, body').css('scroll-behavior', 'smooth');
        });
    });
    $(window).trigger('scroll');
});


function setupMovieAnimations() {
  $('.movie .title, .movie .desc, .movie .release-date, .movie .stars, .movie .rating').css({
    position: 'relative',
    left: '-300px'
  });
  $('.movie .title').css({ top: '-500px' });
  $('.movie .release-date, .movie .stars, .movie .rating').css({ top: '500px' });

  $('.movie').hover(
    function () {
      const $movie = $(this);

      // Animate in elements
      $movie.find('.title').css({ top: '-500px', left: '0' }).stop().animate({ top: '0px' }, 500);
      $movie.find('.release-date').css({ top: '500px' }).stop().animate({ top: '0px', left: '0px' }, 500);
      $movie.find('.stars').css({ top: '500px' }).stop().animate({ top: '0px', left: '0px' }, 500);
      $movie.find('.rating').css({ top: '500px' }).stop().animate({ top: '0px', left: '0px' }, 500);

      // Safely restart the bounce/desc animation
      const $desc = $movie.find('.desc');
      $desc.stop(true, true).removeClass('animate__animated animate__shakeX');

      requestAnimationFrame(() => {
        void $desc[0].offsetWidth; // Force reflow
        $desc
          .css({ left: '0px' }) // Reset position
          .addClass('animate__animated animate__shakeX')
          .one('animationend', function () {
            $(this).removeClass('animate__animated animate__shakeX');
          });
      });
    },
    function () {
      // Animate out
      $(this).find('.title').stop().animate({ left: '-300px' }, 500);
      $(this).find('.desc').stop().animate({ left: '-300px' }, 500);
      $(this).find('.release-date').stop().animate({ left: '-300px' }, 500);
      $(this).find('.stars').stop().animate({ left: '-300px' }, 500);
      $(this).find('.rating').stop().animate({ left: '-300px' }, 500);
    }
  );
}





async function getNowPlaying(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
    rowData.html('');
    let response = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c");
    response = await response.json();
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    // $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}
function displayMovies(arr){
    let cartona = '';
    if (!arr || arr.length === 0) {
        cartona = `<div class="text-center text-danger fs-4">No movies found.</div>`;
    } else {
        for(let i = 0; i < arr.length; i++) {
            // Limit description to 50 words
            let overview = arr[i].overview || "";
            let words = overview.split(' ');
            if(words.length > 30) {
                overview = words.slice(0, 30).join(' ') + '...';
            }

            // Format rating to 1 decimal place
            let rating = Number(arr[i].vote_average).toFixed(1);

            cartona += `
                <div class="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                    <div class="movie position-relative overflow-hidden rounded-2">
                        <img src="https://image.tmdb.org/t/p/w780${arr[i].poster_path}" class="w-100 my-img">
                        <div class="layer d-flex flex-column position-absolute">
                            <h3 class="title text-center position-relative">${arr[i].title}</h3>
                            <p class="desc position-relative">${overview}</p>
                            <p class="release-date position-relative"><span>Release Date : ${arr[i].release_date}</span></p>
                            <h3 class="stars position-relative">
                                ${generateStars(arr[i].vote_average)}
                            </h3>
                            <h3 class="rating rounded-circle position-relative">${rating}</h3>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    rowData.html(cartona);
    setupMovieAnimations();
}
function generateStars(vote_average) {
  const starsCount = vote_average / 2;
  let starsHtml = '';

  for (let i = 1; i <= 4; i++) {
    if (i <= Math.floor(starsCount)) {
      starsHtml += `<i class="fa-solid fa-star text-warning fs-5"></i>`;
    } else if (i === Math.ceil(starsCount) && starsCount % 1 >= 0.5) {
      starsHtml += `<i class="fa-solid fa-star-half-stroke text-warning fs-5"></i>`;
    } else {
      starsHtml += `<i class="fa-regular fa-star text-warning fs-5"></i>`;
    }
  }

  return starsHtml;
}

getNowPlaying()





async function getPopular(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
    rowData.html('');
    $('.inner-loading-spinner, .inner-loading').fadeIn(300);
    let response = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c");
    response = await response.json();
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}

async function getTopRated(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
    rowData.html('');
    $('.inner-loading-spinner, .inner-loading').fadeIn(300);
    let response = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c");
    response = await response.json();
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}

async function getTrending(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
    rowData.html('');
    $('.inner-loading-spinner, .inner-loading').fadeIn(300);
    let response = await fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c");
    response = await response.json();    
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}

async function getUpcoming(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000)
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
    rowData.html('');
    $('.inner-loading-spinner, .inner-loading').fadeIn(300);
    let response = await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c");
    response = await response.json();    
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}





async function search(term){
    $('.inner-loading-spinner, .inner-loading').fadeIn(300);
    if (term ==''){
        $('.inner-loading-spinner, .inner-loading').fadeOut(300);
        return getNowPlaying()
    }
    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=732f1c9d4cd16f1ddbe855e36ed7f04c&query=${term}`);
    response = await response.json();
    response.results ? displayMovies(response.results) : displayMovies([]); ;
    $('.inner-loading-spinner, .inner-loading').fadeOut(300);
}





function contactPage(){
    $('.side-nav').animate({left: -sideNavContentWidth},1000) 
    $('.open-close-icon').addClass('fa-bars')
    $('.open-close-icon').removeClass('fa-x')
}


let hoverState = 'right';

function inputsValidation() {
    const isValid =
        nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation();

    const $btn = $('#submitBtn');

    if (isValid) {
        $btn
            .removeClass('invalid move-left move-right')
            .addClass('myBtn')
            .css('transform', 'translateX(0)')
            .off('mouseenter')
            .css('cursor', 'pointer');
    }else{
    $btn
        .addClass('invalid')
        .removeClass('myBtn')
        .css('cursor', 'default');

    $btn.off('mouseenter').on('mouseenter', function () {
        if (hoverState === 'right') {
            $(this).removeClass('move-left').addClass('move-right');
            hoverState = 'left';
        }else {
            $(this).removeClass('move-right').addClass('move-left');
            hoverState = 'right';
        }
    });
    }
}


function nameValidation() {
    const nameRegex = /^[A-Za-z\s]+$/;
    if(nameRegex.test($('#nameInput').val())){
        $('#nameInput').removeClass('is-invalid').addClass('is-valid');
        $('#nameMsg').addClass('d-none');
        return true;
    }else{
        $('#nameInput').removeClass('is-valid').addClass('is-invalid');
        $('#nameMsg').removeClass('d-none');
        return false;
    }
}
function emailValidation() {
    const nameRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    if(nameRegex.test($('#emailInput').val())){
        $('#emailInput').removeClass('is-invalid').addClass('is-valid');
        $('#emailMsg').addClass('d-none');
        return true;
    }else{
        $('#emailInput').removeClass('is-valid').addClass('is-invalid');
        $('#emailMsg').removeClass('d-none');
        return false;
    }
}
function phoneValidation() {
    const nameRegex = /^\+?[0-9]{10,15}$/;
    if(nameRegex.test($('#phoneInput').val())){
        $('#phoneInput').removeClass('is-invalid').addClass('is-valid');
        $('#phoneMsg').addClass('d-none');
        return true;
    }else{
        $('#phoneInput').removeClass('is-valid').addClass('is-invalid');
        $('#phoneMsg').removeClass('d-none');
        return false;
    }
}
function ageValidation() {
    const nameRegex = /^(1[7-9]|[2-9][0-9])$/;
    if(nameRegex.test($('#ageInput').val())){
        $('#ageInput').removeClass('is-invalid').addClass('is-valid');
        $('#ageMsg').addClass('d-none');
        return true;
    }else{
        $('#ageInput').removeClass('is-valid').addClass('is-invalid');
        $('#ageMsg').removeClass('d-none');
        return false;
    }
}
function passwordValidation() {
    const nameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if(nameRegex.test($('#passwordInput').val())){
        $('#passwordInput').removeClass('is-invalid').addClass('is-valid');
        $('#passwordMsg').addClass('d-none');
        return true;
    }else{
        $('#passwordInput').removeClass('is-valid').addClass('is-invalid');
        $('#passwordMsg').removeClass('d-none');
        return false;
    }
}
function repasswordValidation() {
    const password = $('#passwordInput').val();
    const repassword = $('#repasswordInput').val();

    if (password === repassword) {
        $('#repasswordInput').removeClass('is-invalid').addClass('is-valid');
        $('#repasswordMsg').addClass('d-none');
        return true;
    } else {
        $('#repasswordInput').removeClass('is-valid').addClass('is-invalid');
        $('#repasswordMsg').removeClass('d-none');
        return false;
    }
}
