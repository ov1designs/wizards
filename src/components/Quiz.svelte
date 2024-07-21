<script>
    import { onMount, createEventDispatcher } from 'svelte';
    import { pb, submitQuizResult, currentUser, fetchQuizWithQuestions } from '../lib/pocketbase';
    import { showAlert } from '../lib/store';
    import { t } from '../lib/i18n';
    import Icon from "@iconify/svelte";
  
    const dispatch = createEventDispatcher();
  
    export let quizId;
    
    let quiz;
    let questions = [];
    let userAnswers = {};
    let quizCompleted = false;
    let score = 0;
    let isLoading = true;
    let questionsPerPage = 5;
    let currentPage = 1;
  
    function resetQuiz() {
      userAnswers = {};
      quizCompleted = false;
      score = 0;
      currentPage = 1;
      questions.forEach(q => userAnswers[q.id] = null);
    }

    onMount(async () => {
      await loadQuiz();
    });

    async function loadQuiz() {
      isLoading = true;
      const quizData = await fetchQuizWithQuestions(quizId);
      if (quizData) {
        quiz = quizData.quiz;
        questions = quizData.questions;
        resetQuiz();
      } else {
        showAlert("Failed to load quiz. Please try again.", "fail");
      }
      isLoading = false;
    }
  
    function selectAnswer(questionId, answerId) {
      userAnswers[questionId] = answerId;
    }
  
    function isAnswerCorrect(questionId) {
      const question = questions.find(q => q.id === questionId);
      return userAnswers[questionId] === question.correct_answer;
    }
  
    function completeQuiz() {
      score = questions.reduce((acc, question) => {
        return acc + (isAnswerCorrect(question.id) ? 1 : 0);
      }, 0);
      quizCompleted = true;
      
      if (calculatePassPercentage(score) >= quiz.minimum_pass_score) {
        submitResult();
      }
    }
  
    function calculatePassPercentage(score) {
      return (score / questions.length) * 100;
    }
  
    async function submitResult() {
      if ($currentUser) {
        const result = await submitQuizResult($currentUser.id, quizId, score, true);
        if (result) {
          showAlert("Quiz passed successfully!", "success");
        } else {
          showAlert("Failed to submit quiz result. Please try again.", "fail");
        }
      }
    }
  
    function endQuiz() {
      dispatch('endQuiz');
    }

    $: paginatedQuestions = questions.slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);
    $: totalPages = Math.ceil(questions.length / questionsPerPage);
    $: allQuestionsAnswered = Object.values(userAnswers).every(answer => answer !== null);
    $: quizPassed = quizCompleted && calculatePassPercentage(score) >= quiz?.minimum_pass_score;
</script>

<div class="quiz-container bg-[#281C6C] text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <Icon icon="svg-spinners:bars-scale-fade" class="text-6xl text-[#6248FF]" />
      </div>
    {:else if !quizCompleted || !quizPassed}
      <h2 class="text-2xl font-bold mb-4">{quiz?.title}</h2>
      <p class="mb-4">Page {currentPage} of {totalPages}</p>
      
      {#each paginatedQuestions as question (question.id)}
        <div class="question space-y-4 mb-8">
          <h3 class="text-xl font-semibold">{question.question_text}</h3>
          <div class="space-y-2">
            {#each question.answers as answer}
              <button 
                on:click={() => selectAnswer(question.id, answer.id)}
                class={`w-full text-left p-3 rounded transition-colors ${
                  userAnswers[question.id] === answer.id
                    ? 'bg-[#6248FF] hover:bg-[#6248FF]/80'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {answer.answer_text}
              </button>
            {/each}
          </div>
        </div>
      {/each}
      
      <div class="flex justify-between mt-6">
        {#if currentPage > 1}
          <button 
            on:click={() => currentPage--}
            class="bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
          >
            Previous Page
          </button>
        {:else}
          <div></div>
        {/if}
        
        {#if currentPage < totalPages}
          <button 
            on:click={() => currentPage++}
            class="bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
          >
            Next Page
          </button>
        {:else if allQuestionsAnswered}
          <button 
            on:click={completeQuiz}
            class="bg-green-500 hover:bg-green-600 transition-colors p-3 rounded"
          >
            Submit Quiz
          </button>
        {:else}
          <div></div>
        {/if}
      </div>

      {#if quizCompleted && !quizPassed}
        <div class="mt-6">
          <p class="text-xl mb-2">Your score: {score} / {questions.length} ({calculatePassPercentage(score).toFixed(2)}%)</p>
          <p class="text-lg mb-4">You didn't pass. Please try again.</p>
          <button 
            on:click={resetQuiz}
            class="bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
          >
            Retry Quiz
          </button>
        </div>
      {/if}
    {:else}
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4">Congratulations!</h2>
        <p class="text-xl mb-4">You've successfully passed the quiz.</p>
        <p class="text-lg mb-6">Your score: {score} / {questions.length} ({calculatePassPercentage(score).toFixed(2)}%)</p>
        <button 
          on:click={endQuiz}
          class="flex items-center gap-2 bg-[#6248FF] hover:bg-[#6248FF]/80 transition-colors p-3 rounded"
        >
          <Icon icon="ph:check-circle" />
          Finish Quiz
        </button>
      </div>
    {/if}
</div>