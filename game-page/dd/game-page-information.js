* { box-sizing:border-box; }
body { margin:0; font-family:Arial,Helvetica,sans-serif; color:#222; background:#f4f4f4; }
.site-header { padding:1rem 2rem; background:#20242b; color:white; }
.site-header a { color:white; }
.page-banner { padding:2rem; background:#303844; color:white; }
.page-banner h1 { margin-top:0; }
.page-layout { display:grid; grid-template-columns:minmax(220px,300px) minmax(0,1fr); gap:1.5rem; padding:1.5rem; align-items:start; }
.game-sidebar,.game-section { background:white; border-radius:8px; padding:1.25rem; box-shadow:0 2px 8px #00000012; }
.game-sidebar { position:sticky; top:1rem; }
.game-sidebar img { width:100%; height:auto; display:block; margin-bottom:1rem; }
.game-main-content { min-width:0; display:grid; gap:1rem; }
.game-section h2 { margin-top:0; border-bottom:1px solid #ddd; padding-bottom:.6rem; }
.section-content { line-height:1.6; }
footer { padding:1rem 2rem; }
@media(max-width:800px) { .page-layout { grid-template-columns:1fr; } .game-sidebar { position:static; } }
