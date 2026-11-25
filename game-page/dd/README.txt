'use strict';
/* Information-only field mapping. Media assets are intentionally handled by other scripts. */
window.GamePageInformation = (() => {
  const sections = {
    about:['about','aboutThisGame','description'],story:['story','storyAndWorld'],gameplay:['gameplay'],features:['features','gameFeatures'],
    characters:['characters'],abilities:['abilities','playerAbilities'],anchors:['anchors','specialAbilitySystem'],combat:['combat','combatSystem'],
    enemies:['enemies','enemyAI'],progression:['progression','progressionSystem'],arena:['arena','environmentSystems'],camera:['camera','cameraSystems'],
    controls:['controls','controlsAndMultiplayer'],technical:['technical','technicalOverview'],technicalSystems:['technicalSystems'],
    challenges:['challenges','technicalChallenges'],development:['development','developmentProcess'],milestones:['milestones','developmentMilestones'],
    contributions:['contributions','individualContributions'],team:['team','teamContributions'],learning:['learning','learningOutcomes'],
    future:['future','futureDevelopment'],requirements:['requirements','systemRequirements'],links:['links','externalLinks'],downloads:['downloads'],
    credits:['credits','languagesAndCredits'],documents:['documents','projectDocuments'],additional:['additional','additionalInformation'],ratings:['ratings','reviews'],comments:['comments']
  };
  const sectionTitles = {
    about:'About This Game',story:'Story and World',gameplay:'Gameplay',features:'Game Features',characters:'Characters',abilities:'Player Abilities',anchors:'Special Ability System',combat:'Combat System',enemies:'Enemy AI and Progression',progression:'Progression System',arena:'Arena and Environment Systems',camera:'Camera Systems',controls:'Controls and Multiplayer',technical:'Technical Overview',technicalSystems:'Technical Systems',challenges:'Technical Challenges and Performance',development:'Development Process',milestones:'Development Milestones and Updates',contributions:'Individual Contributions',team:'Team Contributions',tools:'Development Tools',learning:'Learning Outcomes and Achievements',future:'Known Limitations and Future Development',requirements:'System Requirements',links:'External Links and Project Information',downloads:'Downloads',credits:'Languages and Credits',gallery:'Gallery and Screenshots',videos:'Videos and Demonstrations',documents:'Project Documents',additional:'Additional Information',ratings:'Ratings and Reviews',comments:'Comments'
  };
  function readPath(obj,path){return path.split('.').reduce((v,k)=>v==null?undefined:v[k],obj);}
  function findValue(obj,paths){for(const p of paths){const v=readPath(obj,p);if(v!==undefined&&v!==null&&v!=='')return v;}return 'NA';}
  function getFieldValues(project){const out={}; for(const [key,paths] of Object.entries(sections)) out[key]=findValue(project,paths); out.projectTitle=findValue(project,['projectTitle','title','name']);out.gameDescription=findValue(project,['gameDescription','shortDescription','description']);out.tags=findValue(project,['tags','gameTags']);out.gameInformation=findValue(project,['gameInformation','information']);out.developmentInformation=findValue(project,['developmentInformation','developmentInfo']);return out;}
  return {sections,sectionTitles,readPath,findValue,getFieldValues};
})();
