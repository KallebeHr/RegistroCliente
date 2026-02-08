<template>
  <v-app>
    <VLibras position="right" />

    <div v-if="!isLoaded">
      <preloader />
    </div>
    <div v-else>
      
      <router-view />
    </div>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';

  const isLoaded = ref(false);

onMounted(() => {
  const markLoaded = () => {
    setTimeout(() => (isLoaded.value = true), 1000);
  };

  if (document.readyState === 'complete') {
    markLoaded();
  } else {
    const listener = () => {
      if (document.readyState === 'complete') {
        markLoaded();
        document.removeEventListener('readystatechange', listener);
      }
    };
    document.addEventListener('readystatechange', listener);
  }
});
</script>
