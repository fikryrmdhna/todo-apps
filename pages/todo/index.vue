<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="12" class="text-end">
        <v-btn
          prepend-icon="mdi-plus"
          elevation="0"
          color="#fff"
          style="text-transform: none;"
          @click="dialog = true, dialogType = 'add'"
        >
          New Todo
        </v-btn>
      </v-col>

      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
          :title="dialogType === 'add' ? 'Add New Todo' : 'Update Todo'"
        >
          <v-container>
            <form @submit.prevent="addNewTodo">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="subject"
                    label="Subject"
                    variant="outlined"
                    density="compact"
                    type="text"
                    hide-details
                    small
                    clearable
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    label="Description"
                    variant="outlined"
                    density="compact"
                    hide-details
                    small
                    clearable
                    required
                  />
                </v-col>
              </v-row>
            </form>
          </v-container>
          <template v-slot:actions>
            <v-btn
              class="mx-1"
              text="Save"
              color="primary"
              variant="flat"
              :loading="isSaveButtonLoading"
              :disabled="isSaveButtonLoading || (subject === '' || description === '')"
              style="text-transform: none;"
              @click="saveEdit(selectedTodo.id)"
            />
            <v-btn
              class="ms-1 me-3"
              text="Cancel"
              style="text-transform: none;"
              @click="dialog = false, subject = '', description = '', dialogType = '', selectedTodo = {}"
            />
          </template>
        </v-card>
      </v-dialog>

      <v-col cols="5">
        <ul class="mt-10">
          <li v-for="todo in todoStore.todos" :key="todo.id" class="bg-[#ffffff] my-6 rounded-lg py-4 px-6">
            <div class="flex justify-between align-center mb-6">
              <div class="font-sm font-semibold text-[#cb4645]">
                {{ todo.activitiesNo }}
              </div>

              <div>
                <v-btn
                  prepend-icon="mdi-pencil-outline"
                  elevation="0"
                  color="info"
                  variant="flat"
                  size="small"
                  :disabled="todo.status !== ''"
                  style="text-transform: none;"
                  @click="editActivity(todo)"
                >
                  Edit
                </v-btn>
                <v-btn
                  prepend-icon="mdi-trash-can-outline"
                  class="ms-3"
                  elevation="0"
                  color="#cb4645"
                  variant="flat"
                  size="small"
                  style="text-transform: none;"
                >
                  Delete
                </v-btn>
              </div>
            </div>

            <div class="text-xl font-bold text-[#212121]">{{ todo.subject }}</div>
            <div class="text-md font-medium text-slate-600">{{ todo.description }}</div>
            <div class="text-end">
              <v-btn
                  prepend-icon="mdi-check"
                  elevation="0"
                  color="success"
                  :variant="todo.status === 'Done' ? 'flat' : 'plain'"
                  size="small"
                  style="text-transform: none;"
                  @click="toggleStatus(todo, 'Done')"
                >
                  Done
                </v-btn>
                <v-btn
                  prepend-icon="mdi-close"
                  elevation="0"
                  color="#cb4645"
                  :variant="todo.status === 'Cancelled' ? 'flat' : 'plain'"
                  size="small"
                  style="text-transform: none;"
                  @click="toggleStatus(todo, 'Cancelled')"
                >
                  Cancelled
                </v-btn>
            </div>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTodoStore } from '~/stores/todo';
import { useUserStore } from '~/stores/user';

definePageMeta({
  layout: 'default'
})

const todoStore = useTodoStore();
const userStore = useUserStore();
const todos = ref([]);
const dialog = ref(false);
const dialogType = ref('');
const selectedTodo = ref({});
const subject = ref('');
const description = ref('');
const isSaveButtonLoading = ref(false);

watch(userStore, (newState) => {
  if (newState.user) {
    console.log('some state var changed')
    todoStore.fetchTodos(userStore.user.uid)
  }
})

const addNewTodo = async () => {
  await todoStore.addTodo(userStore.user.uid, subject.value, description.value);
  subject.value = '';
  description.value = '';
};

const editActivity = (todo) => {
  console.log('editActivity: ', todo.description)
  dialog.value = true;
  dialogType.value = 'edit';
  selectedTodo.value = todo;
  subject.value = todo.subject;
  description.value = todo.description;
};

const saveEdit = async (todoId) => {
  isSaveButtonLoading.value = true
  await todoStore.updateTodoDetails(userStore.user.uid, todoId, { subject: subject.value, description: description.value })
    .then(() => {
      isSaveButtonLoading.value = false
      dialog.value = false
      subject.value = ''
      description.value = ''
      dialogType.value = ''
      selectedTodo.value = {}
    })
  
};

const toggleStatus = async (todo, newStatus) => {
  console.log('toggleStatus: ', todo, newStatus)
  await todoStore.updateTodoDetails(userStore.user.uid, todo.id, { subject: todo.subject, description: todo.description, status: todo.status }, newStatus)
    .then(async () => {
      await todoStore.fetchTodos(userStore.user.uid)
    })
};

// const deleteTodoItem = async (todoId) => {
//   await todoStore.deleteTodo(todoId);
// };

onMounted(async () => {
  console.log('onMounted: ', userStore)
  if (userStore.user) {
    console.log('userStore.user.uid: ', userStore.user.uid)
  }
});
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>
  