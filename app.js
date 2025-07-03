const quotesArray = [
  "he realized what was happening and told the others.",
  "And in the end it turned out that the creature was her grandfather",
  "when the old man saw his granddaughter",
];

const inputEl = document.querySelector("input");
const quotesEl = document.querySelector(".quotes");
const restartBtn = document.querySelector(".restart_btn");
const cpmEl = document.querySelector(".curr_cpm");
const totalErrorEl = document.querySelector(".total_error");
const errEl = document.querySelector(".curr_error");
const timeEl = document.querySelector(".curr_time");
const accEl = document.querySelector(".curr_acc");

const TIME_LIMIT = 60;

let timeLeft = TIME_LIMIT; //타이머
let timeElapsed = 0; //경과시간 (cpm,wpm등 속도계산시 활용)
let timer = null; //"타이머 아직 없음"이라는 초기 상태 표시용
let totalErrors = 0; //전체 누적용 (끝나고 결과 계산에 사용)
let error = 0; // 현재 문장에만 한정된 에러 수 (화면에 실시간 표시용)
let accuracy = 0; //정확도
let letterTyped = 0; //타자친수
let currentQuote = ""; //현재문구 비어두기
let quoteNo = 0; //quote 순번

function onStartGame() {
  //reset버튼 작동
  onRestart();

  //타이머 시작
  if (!timer) {
    timer = setInterval(onTimer, 1000);
  }

  //qutoe로 메세지 체인지
  displayQutoe();
  cpmEl.textContent = `분석중`;
}

function onTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeElapsed++;
    timeEl.innerText = `${timeLeft}s`;
  } else {
    //시간초과
    inputEl.disabled = true;
    restartBtn.classList.remove("hidden");
    quotesEl.innerText = `😣 시간이 초과되었습니다. 
    재도전은 아래 버튼을 클릭해주세요`;
  }
}

function onInputTyping() {
  const inputValue = inputEl.value;
  const currentInputArray = inputValue.split(""); //입력한 문장을 한문자씩 분해시키기

  letterTyped++; //타자수 카운트
  error = 0;

  let quoteSpans = quotesEl.querySelectorAll("span");
  quoteSpans.forEach((letter, index) => {
    let typedLetter = currentInputArray[index];

    if (!typedLetter) {
      // 타이핑 안했을경우
      letter.classList.remove("correct_span");
      letter.classList.remove("wrong_span");
    } //타자가 일치하는경우
    else if (typedLetter === letter.innerText) {
      letter.classList.add("correct_span");
      letter.classList.remove("wrong_span");
    } //타자 불일치하는 경우
    else {
      letter.classList.add("wrong_span");
      letter.classList.remove("correct_span");
      error++; //틀릴때마다 에러 카운트
    }
  });

  errEl.textContent = error; //오류 카운트 표시

  //정확도 계산.
  let correctLetters = letterTyped - (totalErrors + error);
  let accuracyValue = (correctLetters / letterTyped) * 100;
  accEl.innerText = `${Math.round(accuracyValue)}%`;
  console.log(totalErrors);

  if (inputValue.length === currentQuote.length) {
    displayQutoe();

    //총 오류 업데이트
    totalErrors += error;
    //입력 영역 지우기
    inputEl.value = "";

    // 문장을 순서대로 다음으로 넘기기
    if (quoteNo < quotesArray.length - 1) {
      quoteNo++;
      displayQutoe();
    } //0->1->2까지 오고 끝나서 더이상 안넘어가면 0번째로 다시세팅
    else {
      finishGame();
    }
  }
}

function displayQutoe() {
  quotesEl.textContent = ""; //기존에 보이던 문장을 먼저 지우기
  currentQuote = quotesArray[quoteNo];

  //문자 하나씩 span으로 나눠주기
  currentQuote.split("").forEach((letter) => {
    const quoteSpan = document.createElement("span");
    quoteSpan.innerText = letter;

    quotesEl.appendChild(quoteSpan);
  });
}

function finishGame() {
  clearInterval(timer);
  //input영역 비활성화
  inputEl.disabled = true;
  //마무리 텍스트 출력
  quotesEl.textContent = `😍 고생하셨습니다.
  새로 시작하려면 아래 버튼을 클릭해주세요 `;
  //다시시작 버튼 출력
  restartBtn.classList.remove("hidden");
  //cpm계산 분당 글자수
  let minutesElapsed = timeElapsed / 60;
  let cpm = Math.round(letterTyped / minutesElapsed);
  cpmEl.innerText = `${cpm}타`;
}

function onRestart() {
  clearInterval(timer);
  const TIME_LIMIT = 60;

  timeLeft = TIME_LIMIT; //타이머
  timeElapsed = 0; //경과시간 (cpm,wpm등 속도계산시 활용)
  timer = null; //"타이머 아직 없음"이라는 초기 상태 표시용
  totalErrors = 0; //전체 누적용 (끝나고 결과 계산에 사용)
  error = 0; // 현재 문장에만 한정된 에러 수 (화면에 실시간 표시용)
  accuracy = 0; //정확도
  letterTyped = 0; //타자친수
  quoteNo = 0; //quote 순번

  inputEl.disabled = false;
  inputEl.value = "";
  restartBtn.classList.add("hidden");
  quotesEl.textContent = `게임을 시작하려면 아래를 클릭하세요`;
  timeEl.textContent = `60s`;
  errEl.textContent = error;
  accEl.textContent = accuracy;
  cpmEl.textContent = `...`;

  displayQutoe();
}

restartBtn.addEventListener("click", onRestart);
inputEl.addEventListener("input", onInputTyping);
inputEl.addEventListener("focus", onStartGame);
