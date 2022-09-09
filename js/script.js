//Start Select Elements
let questions_numb = document.querySelector(".questions-numb");
let bullets_spans = document.querySelector(".bullets-spans");
let questions_content = document.querySelector(".questions-content");
let answers_content = document.querySelector(".answers-content");
let submit_btn = document.querySelector(".submit-btn");
let quiz_app_content = document.querySelector(".quiz-app-content");
let quiz_result = document.querySelector(".quiz-result");
let timer_quiz = document.querySelector(".timer");
let quiz_app = document.querySelector(".quiz-app");
//Start Select Elements

//Start Global Variables
let currentI = 0;
let rightAnswersScore = 0;

//End Global Variables


//Creat Function getQuestions
function getQuestions(){
    let theRequest = new XMLHttpRequest();

    theRequest.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            //Questions Number
            let questionsNumber = questionsObject.length;
           //Call Function : Set Questions Number and Creat Bullets
           getNumber_setBullets(questionsNumber);

           //Call Function : Get Question Data
           getQuestionData(questionsObject[currentI] , questionsNumber);


           //Call Function : Timer
           timer(20 , questionsNumber);




           //Click Submit
           submit_btn.onclick = function () {
               //Get The Right Answer
               let rightAnswer = questionsObject[currentI].right_answer;
               
               //Increase The Current Index
               currentI++;

               //Call Function : Check Answer
               checkAnswer(rightAnswer , questionsNumber);

               //Remove Old Question + Answers and Show New Question + Answers
               questions_content.innerHTML = "";
               answers_content.innerHTML = "";

               //Call Function : Get Question Data
               getQuestionData(questionsObject[currentI] , questionsNumber);


               //Call Function : Go Bullets
               goBullets();


               //Timer
               //Clear Timer Interval
               clearInterval(timerInterval);
               //Call Function : Timer
               timer(10 , questionsNumber);

               //Call Function : Show Result
               showResult(questionsNumber);

           };

        }

      
    };

    theRequest.open("GET" , "questions.json" , true);
    theRequest.send();
}



//Call Function getQuestions
getQuestions();

//Functions
//Create Function : Set Questions Number and Create Bullets
function getNumber_setBullets(number){
    //Set Questions Number 
    questions_numb.innerHTML = number;

    for(let i = 0 ; i<number ; i++){
         //Create Bullet span
         let bulletSpan = document.createElement("span");
        
         //Append Bullet To Main Bullets
        bullets_spans.appendChild(bulletSpan);
        //Add Class active To span Bullet The First Bullet
        if(i === 0){
           bulletSpan.className = "act";
        }
    }  
}


// Create Function : Get Question Data 
function getQuestionData(qobject , number){

 if(currentI < number){
 
 //Create Question Title h2
 let questiontitleh2 = document.createElement("h2");

 //Add Class question To Title h2
 questiontitleh2.className = "question";

 //Create Question Text
 let questionText = document.createTextNode(qobject.title);

 //Append Question Text To Question Title
 questiontitleh2.appendChild(questionText);


 //Append Question Title To Questions Content
 questions_content.appendChild(questiontitleh2);


 //Get Answers of Question
 for(let i = 1 ; i<=3 ; i++){
    
    //Create Div answer
    let answerDiv = document.createElement("div");

    //Add Class answer To Div answer
    answerDiv.className = "answer";

     //Create InputRadio
     let inputRadio = document.createElement("input");
    
     //Create Input : type - name - Id -DataSet
    inputRadio.type="radio";
    inputRadio.name="answers";
    inputRadio.id=`answer_${i}`;
    inputRadio.dataset.answer= qobject[`answer_${i}`];


    //Create Label answer
    let answerLabel = document.createElement("label")

    //Add For Attribute To Label answer
    answerLabel.htmlFor = `answer_${i}`;

    //Create Label answer Text
    let answerLabelText = document.createTextNode( qobject[`answer_${i}`])
    
   //Append The Label Text To Laber answer
   answerLabel.appendChild(answerLabelText);

   //Append The Input Radio and The Label and To Div answer 
   answerDiv.appendChild(inputRadio);
   answerDiv.appendChild(answerLabel);

   //Append The Div answer To The Div Answers Content
   answers_content.appendChild(answerDiv);

    //Checked The First Answer
    if(i === 1){
        inputRadio.checked = true;
    }
 }



 }
}



   //Create Function : Check Answer
  function checkAnswer(rAnswer , number){
    
    let allAnswers = document.getElementsByName("answers");
    //The Answer Choosed
    let answerChoosed;
    for(let i = 0; i< allAnswers.length; i++){
       
        if(allAnswers[i].checked){
            answerChoosed=allAnswers[i].dataset.answer;
        }
    }

    if(answerChoosed === rAnswer){
        rightAnswersScore++;
        console.log(rightAnswersScore);
        console.log("Good Answer");
    }
    else{
        console.log("Bad Answer");
    }
}

//Create Function : Go Bullets
function goBullets(){
    let allBullets = document.querySelectorAll(".bullets-spans span");
    console.log(allBullets);
    let arrayOfBullets = Array.from(allBullets);
    arrayOfBullets.forEach((span , index) => {
         if(currentI === index){
            span.className = "act";
         }
    });
}


//Create Function : Show Result
function showResult(number){
    if(currentI === number){
        console.log("Quiz Finish!!");
        /* questions_content.remove();
        answers_content.remove();
        submit_btn.remove(); */

        quiz_app_content.remove();
        bullets_spans.remove();
        timer_quiz.remove();


        quiz_app.style.marginTop = "200px";

         //Create p Result Quiz 
         let pResult = document.createElement("p");



         //Create span Result Quiz
          let spanResult = document.createElement("span");
      
          let resultClass;
          let resultSpanText;
       
           
        
        if(rightAnswersScore === number){
            console.log("Perfect");
            resultClass="perfect";
            resultSpanText="Perfect!";
        }
        else if(rightAnswersScore > number/2 && rightAnswersScore < number){
            console.log("Good");
            resultClass="good";
            resultSpanText="Good!";
           }
        else{
            console.log("Bad");
            resultClass="bad";
            resultSpanText="Bad!";
        }

           

             //Add Class To p Resilt Quiz
             pResult.className = "presult";
             //Add p Result Quiz Text
             let pResultText =document.createTextNode(`The Result Of Quiz : ${rightAnswersScore} From ${number}`);
             //Append p Result Quiz Text To p Result Quiz
             pResult.appendChild(pResultText);
             //Append p To Quiz Result Div
             quiz_result.appendChild(pResult);



     
             //Add Class To span Result Quiz
             spanResult.className = `${resultClass}`;
             //Add span Result Quiz Text
             let spanResultText = document.createTextNode(`${resultSpanText}`);
             //Append span Result Quiz Text To span Result Quiz
             spanResult.appendChild(spanResultText);
             //Append span To Quiz Result Div
             quiz_result.appendChild(spanResult);
    }
}

//Create Function : Timer
function timer(duration , number){
   if(currentI < number){
    timerInterval = setInterval ( function(){
     
        let minutes = parseInt( duration / 60);
        let secondes = parseInt( duration % 60);
   
        minutes = minutes < 10 ? `0${minutes}`: minutes;
        secondes = secondes <10 ? `0${secondes}`: secondes;

        timer_quiz.innerHTML = `${minutes} : ${secondes}`;
        

        if(--duration < 0){
            clearInterval(timerInterval);
            submit_btn.click();
        }

    } , 1000);
   }
}