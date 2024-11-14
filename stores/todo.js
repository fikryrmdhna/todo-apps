import { defineStore } from 'pinia';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    error: null,
  }),
  actions: {
    async fetchTodos(userId) {
      console.log('fetchTodos: ', userId)

      return new Promise(async (resolve, reject) => {
        try {
          console.log('fetchTodos: ', userId);
          const querySnapshot = await getDocs(collection(db, 'users', userId, 'todos'));
          
          if (querySnapshot.empty) {
            console.log('No todos found for this user.');
            this.todos = [];
          } else {
            this.todos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
          resolve()
        } catch (error) {
          reject(error)
          console.error('Error fetching todos:', error);
          this.todos = [];
        }
      })
    },
    async addTodo(userId, subject, description) {
      console.log('addTodo:', userId, subject, description);
      try {
        const activitiesNo = `AC-${String(Date.now()).slice(-4)}`;
        
        const docRef = await addDoc(collection(db, 'users', userId, 'todos'), {
          activitiesNo,
          subject,
          description,
          status: '',
        });
        
        this.todos.push({ id: docRef.id, subject, description, activitiesNo, status: '' });
      } catch (error) {
        console.error('Error adding todo:', error);
        this.error = error.message;
      }
    },
    async updateTodoDetails(userId, todoId, payload, statusValue) {
      console.log('updateTodoDetails:', userId, payload, { ...payload, status: payload.status !== statusValue ? statusValue : '' });
      return new Promise(async (resolve, reject) => {
        try {
          const todoRef = doc(db, 'users', userId, 'todos', todoId);
          await updateDoc(todoRef, { ...payload, status: payload.status !== statusValue ? statusValue : '' });

          resolve()
        } catch (error) {
          console.error('Error updating to-do details:', error);
          this.error = error.message;
          reject(error)
        }
      })
    },
    async deleteTodo(todoId) {
      await deleteDoc(doc(db, 'todos', todoId));
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    },
  },
});