<template>
  <header>
    <h1>Test Nitro Preset AWS Amplify Static</h1>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/post">Post 1</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
    </nav>
  </header>
  <main>
    <NuxtPage />
  </main>
  <footer>
    <p>
      Developed by:
      <NuxtLink
        to="https://github.com/memotux"
        external
        >@memotux</NuxtLink
      >
    </p>
  </footer>
</template>

<style lang="css">
nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 25dvw;
}
main {
  min-height: 80dvh;
}
</style>
