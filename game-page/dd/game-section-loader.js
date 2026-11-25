<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Details</title>
  <link rel="stylesheet" href="game-details.css">
  <script src="game-page-information.js" defer></script>
  <script src="game-section-loader.js" defer></script>
  <script src="game-information-loader/game-information-loader.js" defer></script>
</head>
<body>
  <header class="site-header"><a href="index.html">Home</a><span id="adminToolbar"></span></header>
  <div class="page-banner">
    <h1 id="gameTitle">NA</h1>
    <p id="gameDescription">NA</p>
    <div id="game-tags"></div>
  </div>
  <div class="page-layout">
    <aside class="game-sidebar">
      <img id="coverImage" alt="Game cover" src="" hidden>
      <h2>Game Information</h2><div id="gameInformation"></div>
      <nav class="quick-navigation"><h3>Quick Navigation</h3><div id="quickNavigationLinks"></div></nav>
      <h3>Development Information</h3><div id="developmentInformation"></div>
    </aside>
    <main class="game-main-content" id="gameMainContent" aria-live="polite">
      <p id="sectionsLoading">Loading game sections…</p>
    </main>
  </div>
  <footer><p>Game project information</p></footer>
</body>
</html>
