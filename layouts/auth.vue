<template>
    <v-app>
        <main v-if="!isLayoutLoading">
            <NuxtPage />
        </main>
        <main v-else>
            <div class="fixed h-100 w-100 top-0 left-0 flex items-center justify-center">
                <v-progress-circular
                    :width="3"
                    size="70"
                    color="green"
                    indeterminate
                />
            </div>
        </main>
    </v-app>
</template>

<script setup>
    import { useUserStore } from '~/stores/user';
    import { watch, computed } from 'vue';

    const userStore = useUserStore();
    // const isLayoutLoading = ref(true)

    const userData = computed(() => !!userStore.user);
</script>

<style src="@/assets/css/custom-vuetify.css" />