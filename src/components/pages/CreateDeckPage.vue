<script setup>
import { ref, onMounted } from 'vue'
import { useDeckStore } from '@/stores/deckStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { useTagStore } from '@/stores/tagStore'
import { difficultyOptions } from '@/utils/difficulty'
document.title = "Créer un deck"

const deckStore = useDeckStore()
const flashcardStore = useFlashcardStore()
const tagStore = useTagStore()

const titre = ref('')
const description = ref('')
const difficulte = ref(1)
const deckId = ref(null)
const deckTitre = ref(null)

const question = ref('')
const answer = ref('')
const flashcards = ref([])

const selectedTags = ref([])
const dropdowns = ref([null])

onMounted(async () => {
  await tagStore.fetchTags()
})

function selectTag(index, tagId) {
  selectedTags.value[index] = tagId
  if (index === dropdowns.value.length - 1) dropdowns.value.push(null)
}

async function createDeck() {
  const data = await deckStore.createDeck({
    titre: titre.value,
    description: description.value,
    difficulte: difficulte.value,
    tags: selectedTags.value.filter(Boolean)
  })

  if (!data) return

  deckId.value = data.deck.id
  deckTitre.value = data.deck.titre
}

async function addFlashcard() {
  if (!question.value || !answer.value) return

  const created = await flashcardStore.addFlashcard(deckId.value, {
    question: question.value,
    answer: answer.value
  })

  if (!created) return

  flashcards.value.push(created)
  question.value = ''
  answer.value = ''
}


const newTagName = ref("")

async function addTag() {
  if (!newTagName.value.trim()) return

  const tag = await tagStore.createTag(newTagName.value)

  const lastIndex = dropdowns.value.length - 1
  dropdowns.value[lastIndex] = tag.id
  selectedTags.value[lastIndex] = tag.id
  dropdowns.value.push(null)

  newTagName.value = ""
}
</script>

<template>
  <div class="container">

    <div class="page-title" style="margin-bottom: 25px;">
      <h1>Créer un deck</h1>
    </div>

    <section v-if="!deckId" class="step">
      <h2>Informations du deck</h2>

      <div class="form-group">
        <label>Titre</label>
        <input v-model="titre" type="text" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <input v-model="description" type="text" />
      </div>

      <div class="form-group">
        <label>Difficulté</label>
        <select v-model="difficulte">
          <option v-for="opt in difficultyOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Tags</label>
        <div class="tag-dropdowns">
          <select
            v-for="(value, index) in dropdowns"
            :key="index"
            class="tag-dropdown"
            v-model="dropdowns[index]"
            @change="selectTag(index, dropdowns[index])"
          >
            <option disabled value="">Choisir un tag</option>
            <option
              v-for="tag in tagStore.tags.filter(t => t.id === dropdowns[index] || !selectedTags.includes(t.id))"
              :key="tag.id"
              :value="tag.id"
            >
              {{ tag.nom }}
            </option>
          </select>
        </div>

        <div class="form-group" style="margin-top: 12px;">
          <input v-model="newTagName" placeholder="Nouveau tag" />
          <button @click="addTag" style="margin-top: 8px;">Ajouter</button>
        </div>
      </div>

      <button @click="createDeck" style="margin-top: 8px;">Créer le deck</button>
    </section>

    <section v-else class="step">
      <h2>Deck créé : {{ deckTitre }}</h2>

      <div class="form-group">
        <label>Question</label>
        <input v-model="question" type="text" />
      </div>

      <div class="form-group">
        <label>Réponse</label>
        <input v-model="answer" type="text" />
      </div>

      <button @click="addFlashcard" style="margin-bottom: 24px;">Ajouter la flashcard</button>

      <h3>Flashcards ajoutées</h3>
      <ul class="flashcard-list">
        <li v-for="fc in flashcards" :key="fc.id">
          <strong>{{ fc.question }}</strong> — {{ fc.answer }}
        </li>
      </ul>

      <router-link :to="`/decks/${deckId}`">
        <button style="margin-top: 16px;">Terminer</button>
      </router-link>
    </section>

  </div>
</template>
