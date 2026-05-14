<script setup>
import { useRoute } from 'vue-router'
import { useDeckStore } from '../../stores/deckStore.js'
import { useFlashcardStore } from '../../stores/flashcardStore.js'
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
document.title = "Révisions"

const route = useRoute()

const deckStore = useDeckStore()
const flashcardStore = useFlashcardStore()

const start = ref(false)

function startRevisions(){
  start.value = true;
}

const deck = ref(null)

// cartes du deck
const flashcards = ref([])

//nombre de cartes
const total = ref(0)

const index = ref(0)

const showAnswer = ref(false)

const bonneReponses = ref(0)

const done = computed(() => total.value > 0 && bonneReponses.value === total.value)

const currentCard = computed(() => flashcards.value[index.value])

const cardsReviewed = ref(0)
const durationSeconds = ref(0)
let timer = null

onMounted(async () => {
  deck.value = await deckStore.fetchDeck(route.params.id)

  flashcards.value = [...await flashcardStore.fetchFlashcards(deck.value.id)]

  total.value = flashcards.value.length

  timer = setInterval(() => {
    durationSeconds.value++
  }, 1000)
})

function reveal() {
  showAnswer.value = true
}

function answer(isCorrect) {
  cardsReviewed.value++

  if (isCorrect) {
    bonneReponses.value++

    //supprimmer comme bonne reponse
    flashcards.value.splice(index.value, 1)

    if (bonneReponses.value === total.value) {
      endSession()
      return
    }
  } else {
    index.value++
  }

  showAnswer.value = false

  //boucler sur la liste de cartes
  if (index.value >= flashcards.value.length) {
    index.value = 0
  }
}
//log de la revision
async function endSession() {
  clearInterval(timer)

  await api("https://backend-flashcardulr.onrender.com/api/revision-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deck_id: deck.value.id,
      flashcards_count: cardsReviewed.value,
      duration_seconds: durationSeconds.value
    })
  })
}
</script>

<template>
  <div class="container revision">

    <div class="page-title" style="margin-bottom: 25px;">
      <h1>{{ deck ? `Révision : ${deck.titre}` : 'Révision' }}</h1>
    </div>

    <div class="start-revisions" v-if="!start">
      <button @click="startRevisions()">Démarrer les révisions</button>
    </div>

    <div v-if="start">

      <div v-if="done" class="finished">
        <p style="font-size: 22px">Toutes les cartes sont justes ! </p>
        <router-link to="/decks">
          <button style="margin-top: 20px;">Retour aux decks</button>
        </router-link>
      </div>

      <div v-else-if="currentCard" class="card">
        <div class="card-progress">
          {{ bonneReponses }} / {{ total }} bonnes réponses
        </div>

        <div class="card-question-block">
          <span class="card-label">Question</span>
          <p class="question">{{ currentCard.question }}</p>
        </div>

        <div v-if="showAnswer" class="card-answer-block">
          <span class="card-label">Réponse</span>
          <p class="answer">{{ currentCard.answer }}</p>
        </div>
      </div>

      <div class="start-revisions" v-if="!showAnswer && !done && currentCard">
        <button @click="reveal">Voir la réponse</button>
      </div>

      <div v-if="showAnswer && !done" class="actions">
        <button class="bad" @click="answer(false)">Je ne savais pas</button>
        <button class="good" @click="answer(true)">Je savais</button>
      </div>

    </div>

  </div>
</template>
