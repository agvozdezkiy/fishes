'use strict'

/***********************************
*          КЛАСС РЫБКИ
***********************************/

function Fish(fishImageId, gameFieldId, namberFishes, scoreFieldId) {
        //--Настройки рыбки

    var fishImageTag,
        gameFieldTag,
        scoreFieldTag,
        fileNameLeft,
        fileNameRight,
        fileNameSkeletonLeft,
        fileNameSkeletonRight,
        //--положение рыбки на игровом поле
        posYmin, posYmax,posXmin, posXmax, posX, posY,
        widthSkeletonImage, heightSkeletonImage,
        //--дистанция и скорость (количество точек за шаг анимации) рыбки
        distanceX, distanceY, directionX, directionY, speedX, speedY,
        steps, //--количество шагов анимации для заданной дистанции
        currentStep;

    //--Установка исходных параметров рыбки    
    this.setSourceParam=function(){    
        fishImageTag=document.getElementById(fishImageId);
        gameFieldTag=document.getElementById(gameFieldId);
        scoreFieldTag=document.getElementById(scoreFieldId);
        fileNameLeft='pictures/'+fishImageId+'l.gif';
        fileNameRight='pictures/'+fishImageId+'r.gif';
        fileNameSkeletonLeft='pictures/skeleton_l.gif';
        fileNameSkeletonRight='pictures/skeleton_r.gif';

        fishImageTag.setAttribute('src', fileNameLeft);

        //--задается случайное положение рыбки на игровом поле
        posYmin=gameFieldTag.offsetTop;
        posYmax=gameFieldTag.offsetHeight-fishImageTag.height;
        posXmin=0;
        posXmax=gameFieldTag.offsetWidth-fishImageTag.width;
        posX=Math.random()*(posXmax-posXmin);
        posY=posYmin+Math.random()*(posYmax-posYmin);

        widthSkeletonImage=200;
        heightSkeletonImage=100;
        //--дистанция и скорость (количество точек за шаг анимации) рыбки
        distanceX=0;
        distanceY=0;
        directionX=1;
        directionY=1;
        speedX=5;
        speedY=0;
        steps=0; //--количество шагов анимации для заданной дистанции
        currentStep=0;

        fishImageTag.addEventListener('click', handleEvent)
    };

    //--Задает положение рыбок после изменения размеров окна
    this.setPosAfterGameFieldResizing = function(){
        //--задается случайное положение рыбки на игровом поле
        posYmin=gameFieldTag.offsetTop;
        posYmax=gameFieldTag.offsetHeight-fishImageTag.height;
        posXmin=0;
        posXmax=gameFieldTag.offsetWidth-fishImageTag.width;
        posX=Math.random()*(posXmax-posXmin);
        posY=posYmin+Math.random()*(posYmax-posYmin);

        setRndMoveParam();
    }

    //--Задает случайным образом направление движения рыбки на новом отрезке
    function setRndMoveParam(){
        currentStep=0;

        if(innerWidth-posX > posX){
            distanceX= (Math.random()+1)*(innerWidth-posX)/2;
            directionX=1;
            if(posX+distanceX>posXmax) distanceX=posXmax-posX
            fishImageTag.setAttribute('src', fileNameRight);
        }else{
            distanceX= (Math.random()+1)*posX/2;
            directionX= -1;
            fishImageTag.setAttribute('src', fileNameLeft);
        }

        distanceY=Math.random()*posYmax - posYmax/2;
        if(distanceY<0){
            directionY= -1;
            distanceY*= -1;
            if(posY-distanceY<posYmin) directionY=1;
        } else{
            directionY= 1;
            if(posY+distanceY>posYmax) directionY= -1;
        }

        steps=trim(distanceX/speedX);
        speedY=trim(distanceY/steps);
    }

    //--Расчитывает положение рыбки в новом кадре
    function calculateMove(){
        if(steps===currentStep) setRndMoveParam();
        posX+=(speedX*directionX);
        posY+=(speedY*directionY);
    }

    //--Задает положение рыбки в новом кадре
    function makeMove(){
        //console.log('makeMove');
        fishImageTag.style.left=posX+'px';
        fishImageTag.style.top=posY+'px';
        //console.log('posY ='+posY);                                                                     
        currentStep++;
        // console.log(currentStep); 
    }

    //--Реакция на клик по рыбке: начисляет очки, увеличивает скорость, изменяет направление или убивает рыбку.
    var handleEvent=function(){
        if(gameStatistic.pause) return;
        if(speedX<30){
            gameStatistic.score+=speedX;
            speedX*=2;
        }else{
            gameStatistic.score+=2*speedX;
            speedX=5;
            fileNameLeft=fileNameSkeletonLeft;
            fileNameRight=fileNameSkeletonRight;
            posXmax=gameFieldTag.offsetWidth-widthSkeletonImage;
            posYmax=gameFieldTag.offsetHeight-heightSkeletonImage;
            fishImageTag.removeEventListener('click', handleEvent);
            fishImageTag.setAttribute('class', 'img');
            gameStatistic.skeletons++;
            if(gameStatistic.skeletons===namberFishes){
                gameStatistic.endOfGame=true;
                console.log('Конец игры!');
            }
        }

        scoreFieldTag.innerText = gameStatistic.score;
        setRndMoveParam();
    }

    //--Расчет положения рыбки для нового кадра (шаг цикла игры)
    var oldTime=0;
    var redrawFish=function(newTime){
        if(gameStatistic.pause){
            fishImageTag.setAttribute('class', 'img');
            return;
        }
        if(gameStatistic.endOfGame){
            // gameFieldTag.style.filter = 'blur(2px)';
            document.getElementById('gameOver').setAttribute('class', 'gameOverAnimate gameOver');
        }
        if(newTime-oldTime>80){
             calculateMove();
             makeMove();
             oldTime=newTime;
         }
        requestAnimationFrame(redrawFish);
    }

    //--Запускает цикл игры после паузы
    this.drawFishAfterPause=function(){
        if(fileNameLeft!==fileNameSkeletonLeft)
            fishImageTag.setAttribute('class', 'img cursorPointer');
        requestAnimationFrame(redrawFish);
    }
    
    //--Запускает цикл игры
    this.drawFish=function(){
        setRndMoveParam();
        //console.log(fishImageTag);
        makeMove();
        fishImageTag.style.display='inline';
        //console.log(fishImageTag);
        requestAnimationFrame(redrawFish);
    }
    
    //--Отсекает вещественную часть числа
    function trim(number){
        var res = Math.round(number);
        if(res>number) res--;
        return res;
    }

    this.setSourceParam(); //--Устанавливает исходные параметры рыбки при создании класса
};


/***********************************
*    КЛАСС ИГРОВОЙ СТАТИСТИКИ
***********************************/

var gameStatistic={
    pause: false,
    endOfGame: false,
    skeletons: 0,
    score: 0,

    setSourceParam: function(){
                        this.pause = false;
                        this.endOfGame = false;
                        this.skeletons = 0;
                        this.score = 0;
                    }
};


//--Вешаем прослушки событий от кнопок клавы
var spaceButtonStatus='unpressed';

document.addEventListener("keypress", function(evt){    if(evt.charCode===32){
                                                            if(spaceButtonStatus==='unpressed'){
                                                                gameStatistic.pause = !gameStatistic.pause;
                                                            }
                                                            spaceButtonStatus='pressed';
                                                        }
                                                    }, false);

document.addEventListener("keyup", function(evt){   if(evt.keyCode===32){
                                                        spaceButtonStatus='unpressed';
                                                        if(!gameStatistic.pause)
                                                            for(var i=0; i<6; i++)
                                                                fish[i].drawFishAfterPause();
                                                        }
                                                }, false);


var fish=[],
    namberFishes=6;

//--Функция рестарта игры
function restartGame(){
    gameStatistic.setSourceParam();
    spaceButtonStatus='unpressed';
    document.getElementById('gameField').style.filter = 'none';
    document.getElementById('gameOver').setAttribute('class', 'gameOver');
    document.getElementById('scoreId').innerText = '0';

    for(var i=0; i<namberFishes; i++){
        document.getElementById(i).setAttribute('class', 'img cursorPointer');
        fish[i].setSourceParam();
        fish[i].drawFishAfterPause();
    }
    
}
    
//--Запускаем игру после загрузки страницы
window.onload = function(){
    for(var i=0; i<namberFishes; i++){
        fish[i]=new Fish(i, 'gameField', namberFishes, 'scoreId');
        fish[i].drawFish();
    }
}

//--Меняем положение рыбок после ресайза страницы
window.onresize = function(){
    for(var i=0; i<namberFishes; i++){
        fish[i].setPosAfterGameFieldResizing();
    }
}