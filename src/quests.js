// ===================== Quest content =====================
// Tell steps:
//   { type: 'animal' }                         animal grid (the first quest)
//   { type: 'pick', key, q, options, react }   a grid of picture choices; react[k] = [line, line]
//   { type: 'color', key, q }                  cover-color swatches
//   { type: 'feel' }                           how did it feel
//   { type: 'outloud', say }                   say something out loud, then tap

const READ_QUESTS = [
  {
    id: 'animal', title: 'The Animal Book Hunt',
    lead: 'Somewhere in your house, there is a book with an animal on the cover.',
    steps: ['Find it.', 'Read it.', 'Tell the Sparkees all about it.'],
    ask: 'Did you find a book with an animal on the cover? And read it?',
    sendoff: 'Go find your animal book!',
    cover: { color: '#612C48' },
    tell: [{ type: 'animal' }, { type: 'feel' }, { type: 'outloud', say: 'Tell us one thing that happened in the story. Say it out loud!' }],
  },
  {
    id: 'someone', title: 'Read to Someone',
    lead: 'Read a book out loud to someone. A grown-up, a kid, or even a stuffed animal!',
    steps: ['Pick a book.', 'Find a listener.', 'Read it out loud!'],
    ask: 'Did you read a book out loud to someone?',
    sendoff: 'Go find a listener!',
    cover: { color: '#C76580', emblem: 'heart' },
    tell: [
      { type: 'pick', key: 'who', q: 'Who was listening?', options: [
        ['mom', 'Mom', 'p_mom'], ['dad', 'Dad', 'p_dad'], ['kid', 'A kid', 'p_sister'], ['grown', 'A grown-up', 'p_grandma'], ['stuffy', 'A stuffed animal', 'a_bear'], ['pet', 'A pet', 'a_dog']],
        react: {
          mom: ['Mom! Did she clap?', 'Greg would have clapped.'],
          dad: ['Dad! Excellent choice.', 'Dads have very big ears for listening.'],
          kid: ['A kid! You are basically a teacher now.', 'Professor {name}.'],
          grown: ['A grown-up! Grown-ups love being read to.', 'It makes their ears very happy.'],
          stuffy: ['A stuffed animal!', 'Did it clap? Stuffed animals are terrible at clapping.'],
          pet: ['A pet!', 'Pets understand more than they let on.'],
        } },
      { type: 'feel' },
      { type: 'outloud', sometimes: true, say: 'Read us your favorite line from the book. Out loud!' },
    ],
  },
  {
    id: 'fort', title: 'The Reading Fort',
    lead: 'Make a cozy reading spot. A blanket fort. A pillow pile. A nest under the covers. Then read a book in it.',
    steps: ['Build your cozy spot.', 'Crawl in with a book.', 'Read it!'],
    ask: 'Did you read a book in a cozy spot?',
    sendoff: 'Go build your cozy spot!',
    cover: { color: '#5D6A3E', emblem: 'tent' },
    tell: [
      { type: 'pick', key: 'where', q: 'Where did you read?', options: [
        ['fort', 'Blanket fort', 'e_tent'], ['covers', 'Under the covers', 'e_bed'], ['pillows', 'Pillow pile', 'e_pillow'], ['table', 'Under a table', 'e_table'], ['outside', 'Outside', 'e_sun'], ['silly', 'Somewhere silly', 'a_other']],
        react: {
          fort: ['A blanket fort!', 'The best kind of building. No grown-ups allowed. Unless they bring snacks.'],
          covers: ['Under the covers!', 'Very sneaky. Very cozy.'],
          pillows: ['A pillow pile!', 'Greg once got lost in a pillow pile for three days.'],
          table: ['Under a table!', 'A table is just a roof with legs.'],
          outside: ['Outside!', 'The trees were probably listening too.'],
          silly: ['Somewhere silly!', 'Greg once read a whole book inside a teapot. The teapot loved it.'],
        } },
      { type: 'feel' },
      { type: 'outloud', sometimes: true, say: 'Tell us what the book was about!' },
    ],
  },
  {
    id: 'color', title: 'The Color Hunt',
    lead: 'Find a book with a cover that is mostly one color. Read it!',
    steps: ['Hunt for a colorful cover.', 'Read the book.', 'Tell the Sparkees the color.'],
    ask: 'Did you find a colorful book and read it?',
    sendoff: 'Go hunt for a color!',
    cover: { color: '#E8893F', emblem: 'splash', fromColor: true },
    tell: [
      { type: 'color', key: 'color', q: 'What color was the cover?' },
      { type: 'feel' },
      { type: 'outloud', sometimes: true, say: 'Tell us your favorite part!' },
    ],
  },
  {
    id: 'new', title: 'The Brand-New Book',
    lead: 'Read a book you have never, ever read before.',
    steps: ['Find a book that is new to you.', 'Read the whole thing.', 'Tell the Sparkees what you think.'],
    ask: 'Did you read a brand-new book?',
    sendoff: 'Go find a book you have never read!',
    cover: { color: '#3E5AA8', emblem: 'star' },
    tell: [
      { type: 'feel' },
      { type: 'pick', key: 'again', q: 'Would you read it again?', options: [['yes', 'Yes!', 'e_yes'], ['maybe', 'Maybe', 'e_maybe'], ['no', 'Nope', 'e_no']],
        react: {
          yes: ['Yes! A new favorite!', 'Greg will make room on the shelf.'],
          maybe: ['Maybe! That is fair.', 'Some books need a second try.'],
          no: ['Nope! That is allowed.', 'Not every book is your book. Greg does not like books about soup.'],
        } },
      { type: 'outloud', sometimes: true, say: 'Tell us what happened in it!' },
    ],
  },
  {
    id: 'hero', title: 'The Hero Hunt',
    lead: 'Read a story with a hero in it. A hero is anybody who is brave or kind.',
    steps: ['Find a story with a hero.', 'Read it.', 'Tell the Sparkees about the hero.'],
    ask: 'Did you read a story with a hero in it?',
    sendoff: 'Go find a hero!',
    cover: { color: '#B4502A', emblem: 'shield' },
    tell: [
      { type: 'pick', key: 'hero', q: 'Who was the hero?', options: [
        ['kid', 'A kid', 'p_sister'], ['animal', 'An animal', 'a_fox'], ['grown', 'A grown-up', 'p_dad'], ['creature', 'A creature', 'a_dragon'], ['robot', 'A robot', 'e_robot'], ['other', 'Someone else', 'a_other']],
        react: {
          kid: ['A kid hero!', 'Kids are the bravest. Greg has seen it.'],
          animal: ['An animal hero!', 'Paws can be very brave.'],
          grown: ['A grown-up hero!', 'Grown-ups can be very brave. Especially about spiders.'],
          creature: ['A creature hero!', 'Creatures are underrated. Greg is technically a creature.'],
          robot: ['A robot hero! Beep boop.', 'That means "thank you, robot" in robot.'],
          other: ['A mystery hero!', 'The best heroes are full of surprises.'],
        } },
      { type: 'pick', key: 'did', q: 'What did the hero do?', options: [
        ['save', 'Saved someone', 'e_heart'], ['solve', 'Solved a problem', 'e_bulb'], ['brave', 'Was brave', 'e_shield'], ['kind', 'Was kind', 'e_smile'], ['friend', 'Made a friend', 'e_friends']],
        react: {
          save: ['They saved someone!', 'Greg would like to be saved someday. From a puddle, maybe.'],
          solve: ['They solved a problem!', 'Thinking is a superpower.'],
          brave: ['They were brave!', 'Brave is doing it even when your tummy feels wobbly.'],
          kind: ['They were kind!', 'Kind is the strongest kind of strong.'],
          friend: ['They made a friend!', 'Like you and the Sparkees.'],
        } },
      { type: 'outloud', sometimes: true, say: 'Tell us the bravest part!' },
    ],
  },
  {
    id: 'night', title: 'The Bedtime Book',
    lead: 'At bedtime, read a book about the night, the moon, the stars, or sleeping.',
    steps: ['Wait until bedtime.', 'Read a sleepy book.', 'Tell the Sparkees in the morning.'],
    ask: 'Did you read a bedtime book?',
    sendoff: 'Save this one for bedtime!',
    cover: { color: '#2E3D4A', emblem: 'moon' },
    tell: [
      { type: 'pick', key: 'sky', q: 'What was in the book?', options: [
        ['moon', 'The moon', 'e_moon'], ['stars', 'Stars', 'e_star'], ['sleep', 'Someone sleeping', 'e_bed'], ['dark', 'The dark', 'e_dark'], ['dream', 'A dream', 'e_cloud']],
        react: {
          moon: ['The moon!', 'Greg waves at the moon every night. It never waves back.'],
          stars: ['Stars!', 'Sparkees are related to stars. Very distant cousins.'],
          sleep: ['Someone sleeping!', 'Shh. Greg is whispering now.'],
          dark: ['The dark!', 'The dark is just the day with its eyes closed.'],
          dream: ['A dream!', 'Greg dreams about sandwiches. Every night.'],
        } },
      { type: 'feel' },
      { type: 'outloud', sometimes: true, say: 'Tell us how the story ended!' },
    ],
  },
  {
    id: 'rhyme', title: 'Rhyme Time',
    lead: 'Find a book with rhyming words in it. Cat, hat. Moon, spoon. Greg, egg.',
    steps: ['Find a rhyming book.', 'Read it.', 'Bring back two words that rhyme.'],
    ask: 'Did you read a rhyming book?',
    sendoff: 'Go find some rhymes!',
    cover: { color: '#9A6AB0', emblem: 'note' },
    tell: [
      { type: 'outloud', say: 'Say two words from your book that rhyme. Out loud!' },
      { type: 'feel' },
    ],
  },
  {
    id: 'chapter', title: 'The Chapter Explorer',
    lead: 'Read one chapter of a chapter book. A chapter is like a room in a book. Greg once lived in a chapter for a week. It was about a sock.',
    steps: ['Pick a chapter book.', 'Read one chapter.', 'Tell the Sparkees what happened.'],
    ask: 'Did you read a whole chapter?',
    sendoff: 'Go explore a chapter!',
    cover: { color: '#7A4E33', emblem: 'book' },
    tell: [
      { type: 'pick', key: 'next', q: 'Do you want to know what happens next?', options: [['yes', 'YES!', 'e_yes'], ['bit', 'A little', 'e_maybe'], ['peek', 'I already peeked', 'e_eyes']],
        react: {
          yes: ['YES! The best feeling!', 'That is called a cliffhanger. Greg once hung from a cliff. Not on purpose.'],
          bit: ['A little!', 'Maybe the next chapter will grab you.'],
          peek: ['You peeked!', 'Greg peeks too. Do not tell anyone.'],
        } },
      { type: 'feel' },
      { type: 'outloud', sometimes: true, say: 'Tell us what happened in the chapter!' },
    ],
  },
  {
    id: 'funny', title: 'The Funny Bone',
    lead: 'Find the funniest book in your house. Read it. Try not to laugh. (You will laugh.)',
    steps: ['Find a funny book.', 'Read it with a straight face.', 'Fail. Laugh.'],
    ask: 'Did you read a funny book?',
    sendoff: 'Go find something funny!',
    cover: { color: '#E8A832', emblem: 'smile' },
    tell: [
      { type: 'pick', key: 'laugh', q: 'How much did you laugh?', options: [['little', 'A little', 'e_smile'], ['lot', 'A LOT', 'e_laugh'], ['floor', 'I fell over', 'e_floor']],
        react: {
          little: ['A little giggle!', 'Giggles count. Greg is counting.'],
          lot: ['A LOT!', 'The Sparkees can tell. You are still smiling.'],
          floor: ['You fell over?!', 'That is the highest rating a book can get.'],
        } },
      { type: 'outloud', sometimes: true, say: 'Tell us the funniest part!' },
    ],
  },
];
const COVER_COLORS = [
  ['red', 'Red', '#C8323C'], ['orange', 'Orange', '#E8893F'], ['yellow', 'Yellow', '#F2C94C'], ['green', 'Green', '#6F8A45'], ['blue', 'Blue', '#3E5AA8'],
  ['purple', 'Purple', '#7C5B85'], ['pink', 'Pink', '#E98AA2'], ['black', 'Black', '#2A2230'], ['white', 'White', '#F4EBD9'],
];
const COLOR_REACT = {
  red: ['Red! Like a fire truck.', 'Or a very embarrassed tomato.'], orange: ['Orange!', 'Greg once ate an orange. It was orange.'],
  yellow: ['Yellow! Like a Sparkee!', 'Excellent taste.'], green: ['Green!', 'The color of the whole forest.'],
  blue: ['Blue! Like the sky.', 'Or a whale. Or a whale in the sky.'], purple: ['Purple!', 'The fanciest color. Kings wear purple. And Greg, on Tuesdays.'],
  pink: ['Pink!', 'One of the best colors. Greg checked.'], black: ['Black!', 'Very mysterious. Very cool.'], white: ['White!', 'Like a cloud. Or a page before the story.'],
};
const FEEL_REACT_LINES = { outloud: [["We're listening!", 'We have very small ears, but we are doing our best.'], ['Ooh, tell us!', 'Greg is all ears. Greg is mostly fuzz, but also ears.'], ['Shh! Story!', 'Gregory is listening too. Gregory is my mustache.'], ['Go on!', 'Nobody move. Story time.']] };
const STORY_WOW = [['Wow.', 'No way!', 'Tell it again!'], ['Ooooh.', 'Amazing!', 'Again!'], ['Whoa.', 'Hooray!', 'More!']];
const GREG_WOW = ['That is the best thing Greg has heard since Tuesday.', 'Incredible. Greg has goosebumps. Greg does not have a goose.', 'Wonderful! Gregory the mustache is wiggling. That means yes.'];

// ---------------- Art quests ----------------
// size 'doodle': five minutes, any paper. size 'project': a bigger make, with a grown-up, maybe on the weekend.
// Projects give golden presents (keep two).
const ART_PARTS = [['colors', 'The colors', 'e_splash'], ['details', 'Tiny details', 'e_eyes'], ['idea', 'The idea', 'e_bulb'], ['built', 'How I made it', 'e_star'], ['all', 'All of it!', 'e_heart']];
const ART_QUESTS = [
  {
    id: 'family', size: 'project', title: 'The Family Tree',
    icon: 'e_tree',
    icons: ['e_splash', 'e_tree', 'e_heart'],
    lead: 'Draw a big tree with your whole family on it. Grown-ups, kids, babies, grandparents, and pets all count!',
    steps: ['Get paper and crayons.', 'Draw a big tree.', 'Put your whole family on it!'],
    aside: '(A big project! Ask a grown-up who else belongs on your tree.)',
    ask: 'Did you make your family tree?',
    tell: ['photo', 'family', 'feel'],
    frame: 'big',
  },
  {
    id: 'greg', size: 'doodle', title: 'Super Greg',
    icon: 'e_shield',
    icons: ['e_splash', 'e_shield', 'e_star'],
    lead: 'Draw Greg as a superhero! Give him three things that show his superpowers. A cape? A laser mustache? You decide.',
    steps: ['Grab a pencil or crayons.', 'Draw Super Greg.', 'Add three superpower things!'],
    aside: '(Greg would like you to know his mustache is named Gregory.)',
    ask: 'Did you draw Super Greg?',
    tell: ['photo', { key: 'power', q: "What is Greg's best superpower?", options: [['fly', 'Flying', 'e_cloud'], ['strong', 'Super strong', 'e_shield'], ['smart', 'Super smart', 'e_bulb'], ['kind', 'Super kind', 'e_heart'], ['stache', 'Mustache power', 'e_star']],
      react: { fly: ['Flying! Greg is afraid of heights.', 'But Super Greg is not. Super Greg loves heights.'], strong: ['Super strong!', 'Super Greg can lift a whole sandwich.'], smart: ['Super smart!', 'Super Greg knows every number. Even eleventy.'], kind: ['Super kind!', 'The best superpower. Dot is not crying. Dot is sparkling.'], stache: ['Mustache power!', 'Gregory the mustache has been waiting his whole life for this.'] } }],
    after: [['dot', 'Greg is going to hang this on his ceiling so he can look at it while he naps.']],
  },
  {
    id: 'food', size: 'doodle', title: 'The Giant Snack',
    icon: 'e_apple',
    icons: ['e_splash', 'e_star', 'e_smile'],
    lead: 'Draw your favorite food, but GIANT. Then draw a tiny Sparkee climbing up it.',
    steps: ['Grab a pencil or crayons.', 'Draw a GIANT snack.', 'Add a tiny Sparkee climbing it!'],
    aside: '(Please do not eat the drawing. Dot tried. It tasted like paper.)',
    ask: 'Did you draw your giant snack?',
    tell: ['photo', 'feel'],
    after: [['dot', 'Is that Sparkee going to eat it, or live in it? Both. Definitely both.']],
  },
  {
    id: 'card', size: 'doodle', title: 'A Card for Someone',
    icon: 'e_heart',
    icons: ['e_book', 'e_splash', 'e_heart'],
    lead: 'Make a card for someone you love. Fold the paper, draw on the front, and give it to them!',
    steps: ['Fold a piece of paper.', 'Draw on it and decorate it.', 'Give it to someone you love!'],
    aside: '(Grown-ups can help with the words inside.)',
    ask: 'Did you make a card and give it to someone?',
    tell: ['photo', 'who', 'feel'],
  },
  {
    id: 'door', size: 'doodle', title: 'The Secret Door',
    icon: 'e_key',
    icons: ['e_splash', 'e_bulb', 'e_star'],
    lead: 'Draw a secret door. Then draw what is behind it! A dragon? A pool of pudding? A very small king?',
    steps: ['Grab a pencil or crayons.', 'Draw a secret door.', 'Draw what is behind it!'],
    aside: '(Dot has a secret door. It leads to another, smaller secret door.)',
    ask: 'Did you draw your secret door?',
    tell: ['photo', 'feel'],
  },
  {
    id: 'sparkee', size: 'doodle', title: 'Invent a Sparkee',
    icon: 'e_smile',
    icons: ['e_splash', 'e_star', 'e_smile'],
    lead: 'Invent a brand-new Sparkee! What color is it? What does it wear? What is its very important job?',
    steps: ['Grab a pencil or crayons.', 'Draw a brand-new Sparkee.', 'Give it a name and a job!'],
    aside: '(Greg\'s job is being Greg. He is very good at it.)',
    ask: 'Did you invent a new Sparkee?',
    tell: ['photo', 'name', 'feel'],
  },
  {
    id: 'mashup', size: 'doodle', title: 'Animal Mashup',
    icon: 'a_other',
    icons: ['e_splash', 'e_bulb', 'e_smile'],
    lead: 'Draw an animal that is half one animal and half another. A cat-fish? A pig-eon? A giraffe-bunny?',
    steps: ['Pick two animals.', 'Squish them together in a drawing.', 'Give it a silly name!'],
    aside: '(Dot is half Sparkee and half more Sparkee.)',
    ask: 'Did you draw an animal mashup?',
    tell: ['photo', 'name', 'feel'],
  },
  {
    id: 'room', size: 'doodle', title: 'Dream Room',
    icon: 'e_bulb',
    icons: ['e_splash', 'e_bulb', 'e_star'],
    lead: 'Design a brand-new room for the treehouse. What is in it? A slide? A snack fountain? Draw it!',
    steps: ['Grab a pencil or crayons.', 'Imagine a new room.', 'Draw everything inside it!'],
    aside: '(The Sparkee builders are watching. They take notes.)',
    ask: 'Did you design a dream room?',
    tell: ['photo', 'feel'],
    after: [['dot', 'Dot is showing this to the builders. They are very excited. One of them fainted a little.']],
  },
  {
    id: 'map', size: 'doodle', title: 'Treasure Map',
    icon: 'e_map',
    icons: ['e_splash', 'e_eyes', 'e_star'],
    lead: 'Draw a treasure map of your room or your house. Put a big X where the treasure is!',
    steps: ['Grab a pencil or crayons.', 'Draw a map of your room.', 'Mark the treasure with an X!'],
    aside: '(The treasure can be anything. Socks count.)',
    ask: 'Did you draw a treasure map?',
    tell: ['photo', 'feel'],
  },
  {
    id: 'house', size: 'project', title: 'A House for a Sparkee',
    icon: 'e_tent',
    icons: ['e_tent', 'e_star', 'e_heart'],
    lead: 'Build a tiny house for a Sparkee, out of a box, paper, tape, and anything else you find. Doors! Windows! A bed!',
    steps: ['Find a small box.', 'Build a Sparkee house.', 'Add doors, windows, and a cozy bed!'],
    aside: '(A big project! Grab a grown-up and some tape.)',
    ask: 'Did you build a Sparkee house?',
    tell: ['photo', 'part', 'feel'],
    after: [['dot', 'A Sparkee could live there. A Sparkee WILL live there. Dot is moving in tonight.']],
  },
  {
    id: 'clay', size: 'project', title: 'Clay Creature',
    icon: 'e_squish',
    icons: ['e_smile', 'e_star', 'e_heart'],
    lead: 'Make a creature out of clay or play dough. Give it legs, eyes, and maybe a tail!',
    steps: ['Get some clay or play dough.', 'Squish, roll, and shape a creature.', 'Give it a name!'],
    aside: '(A big project! Squishing is allowed. Squishing is encouraged.)',
    ask: 'Did you make a clay creature?',
    tell: ['photo', 'name', 'part', 'feel'],
  },
  {
    id: 'collage', size: 'project', title: 'The Big Collage',
    icon: 'e_splash',
    icons: ['e_splash', 'e_star', 'e_heart'],
    lead: 'Make a picture out of cut-up paper. Magazines, wrapping paper, old drawings. Cut, glue, and make something new!',
    steps: ['Find paper to cut up.', 'Cut out shapes and pieces.', 'Glue them into a picture!'],
    aside: '(A big project! Ask a grown-up for the scissors and glue.)',
    ask: 'Did you make a collage?',
    tell: ['photo', 'part', 'feel'],
  },
  {
    id: 'robot', size: 'project', title: 'Cardboard Robot',
    icon: 'e_robot',
    icons: ['e_robot', 'e_star', 'e_heart'],
    lead: 'Build a robot out of boxes, tubes, bottle caps, and tape. What does your robot do?',
    steps: ['Collect boxes and tubes.', 'Tape them into a robot.', 'Decide what your robot does!'],
    aside: '(A big project! Recycling bins are full of robot parts.)',
    ask: 'Did you build a cardboard robot?',
    tell: ['photo', 'name', 'part', 'feel'],
    after: [['dot', 'Beep boop. That means "Dot loves it" in robot.']],
  },
];
const FAMILY = [
  ['me', 'Me', 'p_me'], ['mom', 'Mom', 'p_mom'], ['dad', 'Dad', 'p_dad'], ['brother', 'Brother', 'p_brother'], ['sister', 'Sister', 'p_sister'],
  ['baby', 'Baby', 'p_baby'], ['grandma', 'Grandma', 'p_grandma'], ['grandpa', 'Grandpa', 'p_grandpa'], ['aunt', 'Aunt', 'p_aunt'], ['uncle', 'Uncle', 'p_uncle'],
  ['cousin', 'Cousin', 'p_cousin'], ['dog', 'Dog', 'a_dog'], ['cat', 'Cat', 'a_cat'], ['fish', 'Fish', 'a_fish'], ['other', 'Someone else', 'a_other'],
];
const READ_FEELS = [['funny', 'Giggly', 'laugh'], ['exciting', 'Excited', 'star'], ['cozy', 'Cozy', 'cozy'], ['sad', 'Sad', 'sad']];
const ART_FEELS = [['fun', 'Happy', 'laugh'], ['proud', 'Proud', 'star'], ['calm', 'Calm', 'cozy'], ['tricky', 'Frustrated', 'sad']];
const ART_FEEL_REACT = {
  fun: ['Happy! Art should be happy.', 'Dot is doing a happy dance. It is mostly wiggling.'],
  proud: ['Proud! You should be.', 'Dot is proud too. Dot is so proud, she is sparkling on purpose.'],
  calm: ['Calm. Like a quiet river.', 'Or a sleepy noodle. Art can be very calm.'],
  tricky: ['Frustrated! Art does that sometimes.', 'But you kept going. That is the secret part of art.'],
};

// ---------------- Food quests (kitchen) ----------------
const TASTES = [['crunchy', 'Crunchy', 'e_crunch'], ['squishy', 'Squishy', 'e_squish'], ['sweet', 'Sweet', 'e_candy'], ['sour', 'Sour', 'e_lemon'], ['salty', 'Salty', 'e_salt'], ['spicy', 'Spicy', 'e_pepper']];
const TASTE_REACT = {
  crunchy: ['Crunchy! Chef Noodle loves a crunch.', 'Crunch is the sound food makes when it is happy.'],
  squishy: ['Squishy!', 'Squishy food is just food giving you a hug.'],
  sweet: ['Sweet!', 'Like a cookie. Or Greg, on Tuesdays.'],
  sour: ['Sour! Your face probably did a thing.', 'That is the sour face. It is a very good face.'],
  salty: ['Salty!', 'Like the ocean. Chef Noodle has never been to the ocean. He has seen a picture of a fish.'],
  spicy: ['Spicy! Whoa!', 'Chef Noodle once ate a spicy pepper and sneezed for a week.'],
};
const VERDICT = [['yum', 'Yum!', 'e_smile'], ['ok', "It's okay", 'e_maybe'], ['notyet', 'Not yet', 'e_cloud']];
const VERDICT_REACT = {
  yum: ['YUM! A new favorite!', 'Chef Noodle is writing it in his recipe book. In crayon.'],
  ok: ['It\'s okay! That is a real answer.', 'Some foods are okay. Okay is a fine thing to be.'],
  notyet: ['Not yet! That counts too.', 'Your tongue is still deciding. Tongues take their time. Trying is the brave part.'],
};
const FOOD_QUESTS = [
  {
    id: 'bite', title: 'One Brave Bite',
    lead: 'Try a food you have never tried before. Or one you think you do not like. One bite counts!',
    steps: ['Pick a brand-new food.', 'Take one brave bite.', 'Tell Chef Noodle how it tasted.'],
    icons: ['e_eyes', 'e_shield', 'e_smile'],
    ask: 'Did you take a brave bite?',
    tell: [{ type: 'pick', key: 'bite', q: 'How brave was it?', options: [['lick', 'A tiny lick', 'e_smile'], ['one', 'One bite', 'e_shield'], ['two', 'Two bites', 'e_star'], ['all', 'I ate it ALL', 'e_laugh']],
      react: { lick: ['A tiny lick! That counts.', 'Licks are bites for beginners.'], one: ['One whole bite! Brave!', 'Chef Noodle salutes you with a spoon.'], two: ['TWO bites!', 'That is twice as brave. Chef Noodle did the math.'], all: ['You ate it ALL?!', 'Chef Noodle has to sit down. On a muffin.'] } },
      { type: 'taste' }, { type: 'verdict' }],
    cover: { emblem: 'shield' },
  },
  {
    id: 'veggie', title: 'Veggie Hero',
    lead: 'Eat a vegetable with a meal. A whole serving. Be a hero to your insides!',
    steps: ['Find a vegetable on your plate.', 'Eat it up!', 'Tell Chef Noodle which one.'],
    icons: ['e_carrot', 'e_broccoli', 'e_smile'],
    ask: 'Did you eat a vegetable?',
    tell: [{ type: 'pick', key: 'veg', q: 'Which vegetable?', options: [['carrot', 'Carrot', 'e_carrot'], ['broccoli', 'Broccoli', 'e_broccoli'], ['peas', 'Peas', 'e_peas'], ['corn', 'Corn', 'e_corn'], ['pepper', 'Pepper', 'e_pepper'], ['cucumber', 'Cucumber', 'e_cucumber'], ['other', 'Another one', 'e_mystery']],
      react: { carrot: ['A carrot! Crunch crunch.', 'Rabbits are very jealous of you right now.'], broccoli: ['Broccoli! Tiny trees!', 'You ate a forest. Chef Noodle is impressed and a little worried.'], peas: ['Peas! Little green balls of power.', 'Chef Noodle once tried to juggle peas. He is still finding them.'], corn: ['Corn! Yellow, like a Sparkee.', 'Please do not eat any Sparkees.'], pepper: ['A pepper!', 'Peppers come in red, yellow, green, and orange. They cannot decide.'], cucumber: ['Cucumber! Cool as a cucumber.', 'That is where the saying comes from. Chef Noodle thinks.'], other: ['A mystery vegetable!', 'The best kind. Chef Noodle loves a mystery.'] } },
      { type: 'verdict' }],
    cover: { emblem: 'broccoli' },
  },
  {
    id: 'rainbow', title: 'Rainbow Plate',
    lead: 'Eat foods of three different colors in one meal. Red tomato, orange carrot, green peas... make a rainbow!',
    steps: ['Look at your plate.', 'Find three colors.', 'Eat the rainbow!'],
    icons: ['e_eyes', 'e_splash', 'e_smile'],
    ask: 'Did you eat a rainbow plate?',
    tell: [{ type: 'colors' }, { type: 'verdict' }],
    cover: { emblem: 'splash' },
  },
  {
    id: 'cook', title: 'Junior Chef',
    lead: 'Help a grown-up cook something. Stir, pour, wash, measure, or sprinkle!',
    steps: ['Find a grown-up who is cooking.', 'Ask to help.', 'Do a cooking job!'],
    icons: ['e_spoon', 'e_star', 'e_smile'],
    ask: 'Did you help cook?',
    tell: [{ type: 'pick', key: 'job', q: 'What was your job?', options: [['stir', 'Stirring', 'e_spoon'], ['wash', 'Washing', 'e_splash'], ['pour', 'Pouring', 'e_cup'], ['egg', 'Cracking eggs', 'e_egg'], ['measure', 'Measuring', 'e_cup'], ['sprinkle', 'Sprinkling', 'e_salt']],
      react: { stir: ['Stirring! Round and round.', 'Chef Noodle stirs so fast he gets dizzy. Then he stirs the other way.'], wash: ['Washing! Clean food is happy food.', 'Chef Noodle washes his spoons every day. And his feet, sometimes.'], pour: ['Pouring! Steady hands.', 'Chef Noodle once poured soup into his hat. On purpose. He was saving it.'], egg: ['Cracking eggs! Crack!', 'Did any shell get in? Shell is just crunchy egg.'], measure: ['Measuring! A real chef skill.', 'One cup. Two cups. Eleventy cups.'], sprinkle: ['Sprinkling! The fanciest job.', 'Sprinkle sprinkle. Chef Noodle sprinkles with his eyes closed. For drama.'] } },
      { type: 'verdict' }],
    cover: { emblem: 'spoon' },
  },
  {
    id: 'table', title: 'Table Setter',
    lead: 'Set the table for a family meal. Plates, forks, cups, napkins. Make it fancy!',
    steps: ['Ask how many people are eating.', 'Set out plates and forks.', 'Add one fancy thing!'],
    icons: ['e_table', 'e_spoon', 'e_star'],
    ask: 'Did you set the table?',
    tell: [{ type: 'pick', key: 'fancy', q: 'What was your fancy thing?', options: [['napkin', 'Folded napkins', 'e_star'], ['flower', 'A flower', 'e_sun'], ['candle', 'A candle', 'e_bulb'], ['card', 'Name cards', 'e_book'], ['other', 'Something else', 'e_mystery']],
      react: { napkin: ['Folded napkins! Very fancy.', 'Chef Noodle can fold a napkin into a swan. It looks like a potato.'], flower: ['A flower! Beautiful.', 'Chef Noodle tried to eat a flower once. Do not do that.'], candle: ['A candle! (With a grown-up.)', 'Very fancy. Very glowy. Very Sparkee.'], card: ['Name cards! So everyone knows where to sit.', 'Chef Noodle\'s name card just says "NOODLE."'], other: ['Something fancy!', 'Fancy is a feeling. You have it.'] } }],
    cover: { emblem: 'table' },
  },
  {
    id: 'detective', title: 'Taste Detective',
    lead: 'Close your eyes. A grown-up gives you a little bite of something. Can you guess what it is?',
    steps: ['Find a grown-up helper.', 'Close your eyes and take a taste.', 'Guess what it is!'],
    icons: ['e_eyes', 'e_smile', 'e_bulb'],
    ask: 'Were you a taste detective?',
    tell: [{ type: 'pick', key: 'guess', q: 'Did you guess it?', options: [['yes', 'Yes!', 'e_yes'], ['almost', 'Almost', 'e_maybe'], ['no', 'Nope!', 'e_no']],
      react: { yes: ['You guessed it! Detective {name}!', 'Chef Noodle is giving you a tiny badge. It is a cracker.'], almost: ['Almost! So close.', 'Close counts in detective work. And in hugs.'], no: ['Nope! A real mystery.', 'The best detectives get fooled sometimes. Chef Noodle once guessed "a shoe." It was a pancake.'] } },
      { type: 'taste' }],
    cover: { emblem: 'mystery' },
  },
  {
    id: 'fruit', title: 'Fruit Explorer',
    lead: 'Try a fruit you do not eat very often. A kiwi? A mango? A blueberry? Explore!',
    steps: ['Pick a fruit to explore.', 'Try it!', 'Tell Chef Noodle what it was like.'],
    icons: ['e_apple', 'e_smile', 'e_star'],
    ask: 'Did you explore a fruit?',
    tell: [{ type: 'taste' }, { type: 'verdict' }],
    cover: { emblem: 'apple' },
  },
];

// ---------------- Routines (bathroom) ----------------
const ROUTINES = [
  ['brush', 'Brush my teeth', 'e_brush'],
  ['floss', 'Floss', 'e_floss'],
];
const JAR_SIZE = 8;

// ---------------- Room items (presents) ----------------
// Each item: room, intro lines, and where it lives. Drawing is in art.js (drawItem).
const ITEMS = {
  beanbag: { room: 'library', lines: ['A beanbag chair! For flopping.', 'Sparkees are excellent floppers.'] },
  lights: { room: 'library', lines: ['Fairy lights! They twinkle.', 'Twinkling is our favorite thing to watch.'] },
  headphones: { room: 'library', wear: 'headphones', lines: ['Tiny headphones! Sparkee-sized.', 'For listening to very tiny music.'] },
  plant: { room: 'library', lines: ['A big leafy plant!', 'Plants like stories too. They just listen very slowly.'] },
  globe: { room: 'library', lines: ['A globe! The whole world, but small.', 'Greg likes to spin it and point. He has been to zero places.'] },
  mobile: { room: 'library', lines: ['A star mobile! It spins.', 'For when you want stars indoors.'] },
  telescope: { room: 'library', lines: ['A telescope! For looking at far-away things.', 'Like the moon. Or your own nose, if you hold it backwards.'] },
  portrait: { room: 'library', lines: ['A portrait of you!', 'So we can see you even when you are reading.'] },
  cushions: { room: 'library', lines: ['A pile of cushions!', 'For sitting. Or for building a very soft fort.'] },
  rug: { room: 'studio', lines: ['A rainbow rug!', 'Now even the floor is art.'] },
  sunflower: { room: 'studio', lines: ['A sunflower!', 'It is taller than Dot. Dot has decided to name it Kevin.'] },
  stars: { room: 'studio', lines: ['A string of paper stars!', 'Dot cut out every single one. It took her all week.'] },
  beret: { room: 'studio', wear: 'beret', lines: ['Berets! Real artist hats.', 'One for every Sparkee in the studio. Dot has wanted one for 400 years.'] },
  crayons: { room: 'studio', lines: ['A giant jar of crayons!', 'Every color. Even the weird ones.'] },
  duck: { room: 'bath', lines: ['A rubber duck!', 'Bubbles named it Captain Quack.'] },
  bubbles: { room: 'bath', lines: ['Bubble bath!', 'The tub is full of bubbles now. Bubbles is very proud.'] },
  bathrug: { room: 'bath', lines: ['A fluffy bath mat!', 'For warm feet. Sparkees have very small feet.'] },
  nightlight: { room: 'bath', lines: ['A star nightlight!', 'For brushing your teeth in the dark.'] },
  fern: { room: 'bath', lines: ['A fern!', 'Ferns love bathrooms. It is a fern fact.'] },
  // the last present in the library (level 1): the kitchen key
  kitchenkey: { room: 'library', special: true, lines: ['A golden key!', 'It says KITCHEN on it. Greg is vibrating.'] },
  // the Reading Tower (library level 2)
  glasses: { room: 'tower', wear: 'glasses', lines: ['Reading glasses! Tiny ones.', 'Every Sparkee in the tower gets a pair. Now they look very smart.'] },
  hammock: { room: 'tower', lines: ['A hammock!', 'For reading while swinging. Pip has never been so relaxed.'] },
  fishtank: { room: 'tower', lines: ['A fish tank!', 'The fish is named Sir Bubbles. Bubbles from the bathroom is very confused.'] },
  eggchair: { room: 'tower', lines: ['A hanging egg chair!', 'It is a chair. It is an egg. It is both.'] },
  dragon: { room: 'tower', lines: ['Dragon bookends!', 'They hold the books up. They also guard them. Mostly they nap.'] },
  gramophone: { room: 'tower', lines: ['A music player with a giant horn!', 'It only plays one song. The song is very good.'] },
  constellations: { room: 'tower', lines: ['Painted stars on the ceiling!', 'Now you can stargaze indoors. Pip found a star shaped like a sandwich.'] },
  rocket: { room: 'tower', lines: ['A rocket lamp!', 'It does not fly. It glows. Pip says glowing is basically flying.'] },
  // the kitchen
  pots: { room: 'kitchen', lines: ['Shiny copper pots!', 'Chef Noodle can see his face in them. He waves at himself.'] },
  cookiejar: { room: 'kitchen', lines: ['A cookie jar!', 'It is full of cookies. The locked cookies are finally free.'] },
  herbs: { room: 'kitchen', lines: ['A window box of herbs!', 'Basil, mint, and one that Chef Noodle calls Steve.'] },
  tablecloth: { room: 'kitchen', lines: ['A checkered tablecloth!', 'Now every meal is a picnic. Even breakfast.'] },
  aprons: { room: 'kitchen', wear: 'apron', lines: ['Aprons! For every kitchen Sparkee.', 'Now they can spill things in style.'] },
  fruitbowl: { room: 'kitchen', lines: ['A big fruit bowl!', 'Apples, bananas, and one grape that thinks it is a plum.'] },
  kettle: { room: 'kitchen', lines: ['A whistling kettle!', 'It whistles when it is happy. It is always happy.'] },
  toaster: { room: 'kitchen', lines: ['A toaster!', 'Chef Noodle\'s one recipe is toast. Now he can make it perfectly.'] },
};
const ROOM_POOL = (room) => Object.keys(ITEMS).filter((k) => ITEMS[k].room === room && !ITEMS[k].special);
