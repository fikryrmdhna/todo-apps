<template>
    <v-app>
        <v-app-bar scroll-behavior="elevate">
            <button v-if="userStore.user" @click="userStore.logout">Logout</button>
        </v-app-bar>
        <main>
            <NuxtPage />
        </main>
    </v-app>
</template>

<script setup>
import { useUserStore } from '~/stores/user';
const userStore = useUserStore();
</script>

<style src="@/assets/css/custom-vuetify.css" />