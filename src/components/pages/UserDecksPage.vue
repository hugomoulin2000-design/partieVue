<script setup>
import { ref, onMounted } from 'vue'
import { useDeckStore } from '@/stores/deckStore'
import { useFlashcardStore } from '@/stores/flashcardStore'
import { useTagStore } from '@/stores/tagStore'
import { api } from '@/api'
import { difficultyLabels, difficultyOptions } from '@/utils/difficulty'
document.title = "Mes decks"

const deckStore = useDeckStore()
const flashcardStore = useFlashcardStore()
const tagStore = useTagStore()

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

const loading = ref(true)

const newTagNameEdit = ref('')

onMounted(async () => {
  decks.value = await deckStore.fetchMyDecks()
  const res = await api("https://backend-flashcardulr.onrender.com/api/tags")
  if (res.ok) allTags.value = await res.json()
  loading.value = false
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

async function addTagEdit() {
  if (!newTagNameEdit.value.trim()) return
  const tag = await tagStore.createTag(newTagNameEdit.value)
  allTags.value.push(tag)
  const lastIndex = editDropdowns.value.length - 1
  editDropdowns.value[lastIndex] = tag.id
  editTags.value[lastIndex] = tag.id
  editDropdowns.value.push(null)
  newTagNameEdit.value = ''
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
  <div class="container">

    <div class="page-title" style="margin-bottom: 25px;">
      <h1>Mes decks</h1>
    </div>

    <div v-if="loading" class="no-decks"></div>

    <div v-else-if="decks.length === 0" class="no-decks">
      Aucun decks pour l'instant...
      <router-link to="/decks/creer" class="create-link">
        Créer un deck ?
      </router-link>
    </div>

    <div v-else>
      <div class="decks-grid-2">
        <div v-for="deck in decks" :key="deck.id" class="deck">

          <div v-if="editingDeckId !== deck.id">
            <div class="deck-item-header">
              <h3>{{ deck.titre }}</h3>
              <span class="deck-difficulty">{{ difficultyLabels[deck.difficulte] }}</span>
            </div>
            <p class="deck-description">{{ deck.description }}</p>
            <div class="tags">
              <router-link v-for="tag in deck.tags" :key="tag.id" :to="`/tags/${tag.id}`" class="tag">
                {{ tag.nom }}
              </router-link>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 16px;">
              <button @click="startEditDeck(deck)">Modifier</button>
              <button @click="deleteDeck(deck.id)" class="danger">Supprimer</button>
              <button @click="openDeck(deck.id)">Voir les cartes</button>
            </div>
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

            <div class="form-group" style="margin-top: 12px;">
              <input v-model="newTagNameEdit" placeholder="Nouveau tag" />
              <button @click="addTagEdit" style="margin-top: 8px;">Ajouter</button>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 8px;">
              <button @click="saveEditDeck(deck.id)">Enregistrer</button>
              <button @click="editingDeckId = null" class="btn-outline">Annuler</button>
            </div>
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

  </div>
</template>
