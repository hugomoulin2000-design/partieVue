<script setup>
import { ref, onMounted } from 'vue'
import { useDeckStore } from '@/stores/deckStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { api } from '@/api'
import { difficultyLabels, difficultyOptions } from '@/utils/difficulty'
document.title = "Mes decks"

const deckStore = useDeckStore()
const flashcardStore = useFlashcardStore()

const decks = ref([])
const selectedDeckId = ref(null)
const flashcards = ref([])

const editingDeckId = ref(null)
const editTitre = ref('')
const editDescription = ref('')
const editDifficulte = ref(1)

const allTags = ref([])
const editTags = ref([])
const editDropdowns = ref([null])

const newQuestion = ref('')
const newAnswer = ref('')

const editingCardId = ref(null)
const editQuestion = ref('')
const editAnswer = ref('')

onMounted(async () => {
  decks.value = await deckStore.fetchMyDecks()
  const res = await api("https://backend-flashcardulr.onrender.com/api/tags")
  if (res.ok) allTags.value = await res.json()
})

function startEditDeck(deck) {
  editingDeckId.value = deck.id
  editTitre.value = deck.titre
  editDescription.value = deck.description
  editDifficulte.value = deck.difficulte
  editTags.value = deck.tags?.map(t => t.id) || []
  editDropdowns.value = [...editTags.value, null]
}

function selectEditTag(index, tagId) {
  editTags.value[index] = tagId
  if (index === editDropdowns.value.length - 1) editDropdowns.value.push(null)
}

async function saveEditDeck(id) {
  const ok = await deckStore.updateDeck(id, {
    titre: editTitre.value,
    description: editDescription.value,
    difficulte: editDifficulte.value,
    tags: editTags.value.filter(Boolean)
  })

  if (ok) {
    const d = decks.value.find(d => d.id === id)
    d.titre = editTitre.value
    d.description = editDescription.value
    d.difficulte = editDifficulte.value
    d.tags = allTags.value.filter(t => editTags.value.includes(t.id))
    editingDeckId.value = null
  }
}

async function deleteDeck(id) {
  if (!confirm("Supprimer ce deck ?")) return
  const ok = await deckStore.deleteDeck(id)
  if (ok) decks.value = decks.value.filter(d => d.id !== id)
}

async function openDeck(id) {
  selectedDeckId.value = id
  flashcards.value = await flashcardStore.fetchFlashcards(id)
}

function startEditCard(card) {
  editingCardId.value = card.id
  editQuestion.value = card.question
  editAnswer.value = card.answer
}

async function saveCard(id) {
  const ok = await flashcardStore.updateFlashcard(id, {
    question: editQuestion.value,
    answer: editAnswer.value
  })

  if (ok) {
    const c = flashcards.value.find(c => c.id === id)
    c.question = editQuestion.value
    c.answer = editAnswer.value
    editingCardId.value = null
  }
}

async function deleteCard(id) {
  if (!confirm("Supprimer cette carte ?")) return
  const ok = await flashcardStore.deleteFlashcard(id)
  if (ok) flashcards.value = flashcards.value.filter(c => c.id !== id)
}

async function addFlashcard() {
  if (!newQuestion.value || !newAnswer.value) return

  const ok = await flashcardStore.addFlashcard(selectedDeckId.value, {
    question: newQuestion.value,
    answer: newAnswer.value
  })

  if (ok) {
    flashcards.value.push({
      id: Date.now(),
      question: newQuestion.value,
      answer: newAnswer.value
    })

    newQuestion.value = ''
    newAnswer.value = ''
  }
}
</script>

<template>
  <div class="page">
    <h1>Mes decks</h1>
      <div v-if="decks.length === 0" class="no-decks">
      Aucun decks pour l'instant...
      <router-link to="/create-deck" class="create-link">
        Créer un deck ?
      </router-link>
    </div>

    <div v-else>
    <div v-for="deck in decks" :key="deck.id" class="deck">

      <div v-if="editingDeckId !== deck.id">
        <h2>{{ deck.titre }}</h2>
        <p>{{ deck.description }}</p>
        <p>Difficulté : {{ difficultyLabels[deck.difficulte] }}</p>

        <div class="tags">
          <span v-for="tag in deck.tags" :key="tag.id" class="tag">
            {{ tag.nom }}
          </span>
        </div>

        <button @click="startEditDeck(deck)">Modifier</button>
        <button @click="deleteDeck(deck.id)" class="danger">Supprimer</button>
        <button @click="openDeck(deck.id)">Voir les cartes</button>
      </div>

      <div v-else class="edit-form">
        <input v-model="editTitre" placeholder="Titre" />
        <textarea v-model="editDescription" placeholder="Description"></textarea>

        <label>Difficulté</label>
        <select v-model="editDifficulte">
          <option v-for="opt in difficultyOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <label>Tags</label>

        <div class="tag-dropdowns">
          <select
            v-for="(value, index) in editDropdowns"
            :key="index"
            class="tag-dropdown"
            v-model="editDropdowns[index]"
            @change="selectEditTag(index, editDropdowns[index])"
          >
            <option disabled value="">Choisir un tag</option>

            <option
              v-for="tag in allTags.filter(t => t.id === editDropdowns[index] || !editTags.includes(t.id))"
              :key="tag.id"
              :value="tag.id"
            >
              {{ tag.nom }}
            </option>
          </select>
        </div>

        <button @click="saveEditDeck(deck.id)">Enregistrer</button>
        <button @click="editingDeckId = null">Annuler</button>
      </div>

      <div v-if="selectedDeckId === deck.id" class="flashcards">
        <h3>Flashcards</h3>

        <div class="add-card">
          <input v-model="newQuestion" placeholder="Nouvelle question" />
          <input v-model="newAnswer" placeholder="Nouvelle réponse" />
          <button @click="addFlashcard">Ajouter</button>
        </div>

        <div v-for="card in flashcards" :key="card.id" class="flashcard">
          <div v-if="editingCardId !== card.id">
            <p>Question: {{ card.question }}</p>
            <p>Réponse: {{ card.answer }}</p>

            <button @click="startEditCard(card)">Modifier</button>
            <button class="danger" @click="deleteCard(card.id)">Supprimer</button>
          </div>

          <div v-else>
            <input v-model="editQuestion" />
            <input v-model="editAnswer" />

            <button @click="saveCard(card.id)">Enregistrer</button>
            <button @click="editingCardId = null">Annuler</button>
          </div>
        </div>
      </div>

    </div>
  </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 700px;
  margin: 40px auto;
}

.deck {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.tags {
  margin: 8px 0;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #eee;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.tag-dropdown {
  display: block;
  margin-bottom: 8px;
  padding: 6px;
}

.flashcards {
  margin-top: 20px;
  padding-left: 20px;
}

.flashcard {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
}

.add-card {
  margin-bottom: 20px;
}

.edit-form input,
.edit-form textarea,
.edit-form select {
  width: 100%;
  margin-bottom: 10px;
}

button {
  margin-right: 10px;
}

button.danger {
  background: #d9534f;
  color: white;
}
</style>
