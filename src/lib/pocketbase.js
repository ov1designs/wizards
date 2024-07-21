import PocketBase from "pocketbase";
import { writable } from "svelte/store";
import { showAlert } from "./store";

export const pb = new PocketBase(
  import.meta.env.DEV
    ? import.meta.env.VITE_DEV_PB_URL
    : import.meta.env.VITE_PROD_PB_URL
);

export const currentUser = writable(pb.authStore.model);
export const courses = writable([]);
export const lessons = writable([]);
export const progress = writable([]);
export const resources = writable([]);
export const lesson_faqs = writable([]);
export const lesson_resources = writable([]);

// New quiz-related stores
export const quizzes = writable([]);
export const quiz_questions = writable([]);
export const quiz_answers = writable([]);
export const quiz_results = writable([]);

// Audio recording
export const lesson_audio_submissions = writable([]);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});

// Function to fetch all the records from PocketBase
export const fetchRecords = async () => {
  try {
    const courseRecords = await pb.collection("courses").getFullList({
      sort: "created",
    });

    const lessonRecords = await pb.collection("lessons").getFullList({
      sort: "created",
    });

    const progressRecords = await pb.collection("progress").getFullList({
      sort: "created",
    });

    const resourceRecords = await pb.collection("resources").getFullList({
      sort: "created",
    });

    const lessonFaqsRecords = await pb.collection("lesson_faqs").getFullList({
      sort: "created",
    });

    const lessonResourcesRecords = await pb
      .collection("lesson_resources")
      .getFullList({
        sort: "created",
      });

    // Fetch quiz-related data
    const quizRecords = await pb.collection("quizzes").getFullList({
      sort: "created",
      expand: "lesson",
    });
    console.log("Fetched quizzes:", quizRecords);
    quizzes.set(quizRecords);

    const quizQuestionRecords = await pb.collection("quiz_questions").getFullList({
      sort: "created",
      expand: "quiz,correct_answer",
    });

    const quizAnswerRecords = await pb.collection("quiz_answers").getFullList({
      sort: "created",
      expand: "question",
    });

    const quizResultRecords = await pb.collection("quiz_results").getFullList({
      sort: "created",
      expand: "user,quiz",
    });

    const lessonAudioSubmissionRecords = await pb.collection("lesson_audio_submissions").getFullList({
      sort: "-submitted_at",
      expand: "user,lesson",
    });

    
    

    courses.set(courseRecords);
    lessons.set(lessonRecords);
    progress.set(progressRecords);
    resources.set(resourceRecords);
    lesson_faqs.set(lessonFaqsRecords);
    lesson_resources.set(lessonResourcesRecords);
    lesson_audio_submissions.set(lessonAudioSubmissionRecords);

    // Set quiz-related data
    quizzes.set(quizRecords);
    quiz_questions.set(quizQuestionRecords);
    quiz_answers.set(quizAnswerRecords);
    quiz_results.set(quizResultRecords);

  } catch (error) {
    showAlert("Failed to load data. Please try again", "fail");
  }
};

// Function to update the progress status for a user
export const updateProgressStatus = async (progressRecordId, newStatus) => {
  try {
    const data = {
      status: newStatus,
    };
    const progressRecord = await pb
      .collection("progress")
      .update(progressRecordId, data);
    return progressRecord;
  } catch (error) {
    showAlert("Failed to update course status. Please try again", "fail");
    return null;
  }
};

// Function to fetch a specific quiz with all its questions and answers
export const fetchQuizWithQuestions = async (quizId) => {
  try {
    const quiz = await pb.collection("quizzes").getOne(quizId, {
      expand: "lesson",
    });

    const questions = await pb.collection("quiz_questions").getFullList({
      filter: `quiz="${quizId}"`,
      expand: "correct_answer",
    });

    for (let question of questions) {
      question.answers = await pb.collection("quiz_answers").getFullList({
        filter: `question="${question.id}"`,
      });
    }

    return { quiz, questions };
  } catch (error) {
    showAlert("Failed to load quiz data. Please try again", "fail");
    return null;
  }
};

// Function to submit a quiz result
export const submitQuizResult = async (userId, quizId, score, passed) => {
  try {
    const data = {
      user: userId,
      quiz: quizId,
      score: score,
      passed: passed,
      completed: new Date().toISOString(),
    };
    const result = await pb.collection("quiz_results").create(data);
    return result;
  } catch (error) {
    showAlert("Failed to submit quiz result. Please try again", "fail");
    return null;
  }
};

// Function to get all quiz results for a specific user
export const getUserQuizResults = async (userId) => {
  try {
    const records = await pb.collection('quiz_results').getFullList({
      filter: `user="${userId}"`,
      sort: '-completed',
      expand: 'quiz',
    });
    return records;
  } catch (error) {
    showAlert("Failed to fetch user's quiz results. Please try again", "fail");
    return [];
  }
};

// Function to get all passed quizzes for a specific user
export const getUserPassedQuizzes = async (userId) => {
  try {
    const records = await pb.collection('quiz_results').getFullList({
      filter: `user="${userId}" && passed=true`,
      sort: '-completed',
      expand: 'quiz',
    });
    return records;
  } catch (error) {
    showAlert("Failed to fetch user's passed quizzes. Please try again", "fail");
    return [];
  }
};

// function to audio lesson 
export const createLessonAudioSubmission = async (userId, lessonId, audioFile) => {
  try {
    const data = {
      user: userId,
      lesson: lessonId,
      audio_file: audioFile,
      status: "Submitted",
    };
    const record = await pb.collection("lesson_audio_submissions").create(data);
    return record;
  } catch (error) {
    showAlert("Failed to save audio submission. Please try again", "fail");
    return null;
  }
};

export const getLessonAudioSubmissions = async (lessonId, userId = null) => {
  try {
    let filter = `lesson="${lessonId}"`;
    if (userId) {
      filter += ` && user="${userId}"`;
    }
    const records = await pb.collection('lesson_audio_submissions').getFullList({
      filter: filter,
      sort: '-submitted_at',
      expand: 'user,lesson',
    });
    return records;
  } catch (error) {
    showAlert("Failed to fetch audio submissions. Please try again", "fail");
    return [];
  }
};

export const fetchLessonWithAudio = async (lessonId) => {
  try {
    const lesson = await pb.collection("lessons").getOne(lessonId);
    
    if (lesson.doctor_audio) {
      lesson.doctor_audio_url = getDoctorAudioUrl(lesson);
    }

    return lesson;
  } catch (error) {
    showAlert("Failed to load lesson data. Please try again", "fail");
    return null;
  }
};

export const getDoctorAudioUrl = (lesson) => {
  if (lesson.doctor_audio) {
    const url = pb.files.getUrl(lesson, lesson.doctor_audio);
    console.log("Doctor audio URL:", url);
    return url;
  }
  return null;
};