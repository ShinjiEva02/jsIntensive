function form() {

    let form = document.querySelectorAll('form'),
        successModal = document.querySelector('#successModal'),
        statusMessage = document.createElement('div'),
        message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
        
    statusMessage.classList.add('status');

    for(let i = 0; i < form.length; i++) {

        let input = form[i].getElementsByTagName('input');

        form[i].addEventListener('submit', function(event) {

            event.preventDefault();
            form[i].appendChild(statusMessage);

            let formData = new FormData(form[i]);

            function postData(data) {

                return new Promise(function(resolve, reject) {

                    let request = new XMLHttpRequest(),
                        obj = {};
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

                    data.forEach(function(value, key) {
                        obj[key] = value;
                    });
            
                    request.addEventListener('readystatechange', function() {
                        if(request.readyState < 4) {
                            resolve();  
                        } else if(request.readyState === 4 && request.status == 200){
                            resolve(); 
                        } else {
                            reject();   
                        }
                    });

                    request.send(JSON.stringify(obj));
                });
            }
            
            function clearInput() {
                for(let i = 0; i < input.length; i++) {
                    input[i].value = '';
                }
                statusMessage.textContent = '';
            }

            let closeSuccessModal = document.querySelector('#closeModal');
            closeSuccessModal.addEventListener('click', function() {
                successModal.style.display = 'none';
                more.classList.remove('more-splash');
                document.body.style.overflow = '';
            });
            postData(formData)
                .then(() => statusMessage.textContent = message.loading)
                .then(() => {
                    successModal.style.display = 'block';
                    overlay.style.display = 'none';
                    status.textContent = '';
                })
                .catch(() => statusMessage.textContent = message.failure )
                .then(clearInput)
        });
    }
}

module.exports = form;