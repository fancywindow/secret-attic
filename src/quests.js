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
          grown: ['A grown-up! Grown-ups love being read to.', 'They just forget to ask.'],
          stuffy: ['A stuffed animal!', 'Did it clap? Stuffed animals are terrible at clapping.'],
          pet: ['A pet!', 'Pets understand more than they let on.'],
        } },
      { type: 'feel' },
      { type: 'outloud', say: 'Read us your favorite line from the book. Out loud!' },
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
          silly: ['Somewhere silly!', 'Greg is not going to ask. Greg respects your privacy.'],
        } },
      { type: 'feel' },
      { type: 'outloud', say: 'Tell us what the book was about!' },
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
      { type: 'outloud', say: 'Tell us your favorite part!' },
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
      { type: 'outloud', say: 'Tell us what happened in it!' },
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
          grown: ['A grown-up hero!', 'Sometimes grown-ups get it right.'],
          creature: ['A creature hero!', 'Creatures are underrated. Greg is technically a creature.'],
          robot: ['A robot hero! Beep boop.', 'That means "thank you, robot" in robot.'],
          other: ['A mystery hero!', 'The best heroes are full of surprises.'],
        } },
      { type: 'pick', key: 'did', q: 'What did the hero do?', options: [
        ['save', 'Saved someone', 'e_heart'], ['solve', 'Solved a problem', 'e_bulb'], ['brave', 'Was brave', 'e_shield'], ['kind', 'Was kind', 'e_smile'], ['friend', 'Made a friend', 'e_friends']],
        react: {
          save: ['They saved someone!', 'Greg needs a moment. That is beautiful.'],
          solve: ['They solved a problem!', 'Thinking is a superpower.'],
          brave: ['They were brave!', 'Brave is doing it even when your tummy feels wobbly.'],
          kind: ['They were kind!', 'Kind is the strongest kind of strong.'],
          friend: ['They made a friend!', 'Like you and the Sparkees.'],
        } },
      { type: 'outloud', say: 'Tell us the bravest part!' },
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
      { type: 'outloud', say: 'Tell us how the story ended!' },
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
    lead: 'Read one chapter of a chapter book. Just one. (Or more. We are not the boss of you.)',
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
      { type: 'outloud', say: 'Tell us what happened in the chapter!' },
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
      { type: 'outloud', say: 'Tell us the funniest part!' },
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
const FEEL_REACT_LINES = { outloud: [["We're listening!", 'We have very small ears, but we are doing our best.'], ['Ooh, tell us!', 'Greg is all ears. Greg is mostly fuzz, but also ears.'], ['Go on!', 'Nobody move. Story time.']] };
const STORY_WOW = [['Wow.', 'No way!', 'Tell it again!'], ['Ooooh.', 'Amazing!', 'Again!'], ['Whoa.', 'Hooray!', 'More!']];
const GREG_WOW = ['That is the best thing I have ever heard.', 'Incredible. Greg has goosebumps. Greg does not have a goose.', 'That was wonderful. Truly.'];

// ---------------- Art quests ----------------
const ART_QUESTS = [
  {
    id: 'family', title: 'The Family Tree',
    icons: ['e_splash', 'e_tree', 'e_heart'],
    lead: 'Draw a big tree with your whole family on it. Grown-ups, kids, babies, grandparents, and pets all count!',
    steps: ['Get paper and crayons.', 'Draw a big tree.', 'Put your whole family on it!'],
    aside: '(Ask a grown-up who else belongs on your tree. Family trees can get very big.)',
    ask: 'Did you make your family tree?',
    tell: ['photo', 'family', 'feel'],
    frame: 'big',
  },
  {
    id: 'greg', title: 'A Portrait of Greg',
    icons: ['e_splash', 'e_star', 'e_camera'],
    lead: 'Greg would like a portrait. A very nice one. Draw Greg!',
    steps: ['Get paper and crayons.', "Draw Greg. Don't forget the mustache.", 'Show Dot.'],
    aside: '(Greg would like you to know his left side is his best side.)',
    ask: 'Did you draw Greg?',
    tell: ['photo', 'feel'],
    after: [['dot', 'Is that Greg? Look at that mustache. It is magnificent.'], ['dot', 'Dot will show him. He is going to pretend not to cry.']],
  },
  {
    id: 'food', title: 'Favorite Food',
    icons: ['e_splash', 'e_star', 'e_camera'],
    lead: 'Draw your very favorite food. Make it look so good that Greg gets hungry.',
    steps: ['Get paper and crayons.', 'Draw your favorite food.', 'Show Dot.'],
    aside: '(Please do not eat the drawing.)',
    ask: 'Did you draw your favorite food?',
    tell: ['photo', 'feel'],
    after: [['dot', 'Dot is hungry now. Thank you. This is your fault.']],
  },
  {
    id: 'card', title: 'A Card for Someone',
    icons: ['e_book', 'e_splash', 'e_heart'],
    lead: 'Make a card for someone you love. Fold the paper, draw on the front, and give it to them!',
    steps: ['Fold a piece of paper.', 'Draw on it and decorate it.', 'Give it to someone you love!'],
    aside: '(Grown-ups can help with the words inside.)',
    ask: 'Did you make a card and give it to someone?',
    tell: ['photo', 'who', 'feel'],
  },
  {
    id: 'kitchen', title: 'Imagine the Kitchen',
    icons: ['e_splash', 'e_bulb', 'e_camera'],
    lead: 'The treehouse kitchen is locked. What do you think is behind the door? Draw it!',
    steps: ['Get paper and crayons.', 'Imagine the kitchen.', 'Draw what is inside!'],
    aside: '(Nobody knows. Not even Greg. Especially not Greg.)',
    ask: 'Did you draw the kitchen?',
    tell: ['photo', 'feel'],
    after: [['dot', 'Is THAT what is in there? Dot needs to sit down.'], ['dot', 'Greg has been trying to open that door for years.']],
  },
  {
    id: 'sparkee', title: 'Invent a Sparkee',
    icons: ['e_splash', 'e_star', 'e_smile'],
    lead: 'Invent a brand-new Sparkee! What color is it? Does it have a hat? What is its name?',
    steps: ['Get paper and crayons.', 'Draw a brand-new Sparkee.', 'Give it a name!'],
    aside: '(Sparkees can look like anything. Greg looks like Greg.)',
    ask: 'Did you invent a new Sparkee?',
    tell: ['photo', 'name', 'feel'],
  },
];
const FAMILY = [
  ['me', 'Me', 'p_me'], ['mom', 'Mom', 'p_mom'], ['dad', 'Dad', 'p_dad'], ['brother', 'Brother', 'p_brother'], ['sister', 'Sister', 'p_sister'],
  ['baby', 'Baby', 'p_baby'], ['grandma', 'Grandma', 'p_grandma'], ['grandpa', 'Grandpa', 'p_grandpa'], ['aunt', 'Aunt', 'p_aunt'], ['uncle', 'Uncle', 'p_uncle'],
  ['cousin', 'Cousin', 'p_cousin'], ['dog', 'Dog', 'a_dog'], ['cat', 'Cat', 'a_cat'], ['fish', 'Fish', 'a_fish'], ['other', 'Someone else', 'a_other'],
];
const ART_FEELS = [['fun', 'Fun', 'laugh'], ['proud', 'Proud', 'star'], ['calm', 'Calm', 'cozy'], ['tricky', 'Tricky', 'wide']];
const ART_FEEL_REACT = {
  fun: ['Fun! Art should be fun.', 'Dot is doing a happy dance. That is the happy dance.'],
  proud: ['Proud! You should be.', 'Dot is proud too. Dot is crying a little. Happy tears.'],
  calm: ['Calm. Like a quiet river.', 'Art can be a very quiet thing.'],
  tricky: ['Tricky! But you did it anyway.', 'That is what real artists do.'],
};

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
  headphones: { room: 'library', lines: ['Tiny headphones! Sparkee-sized.', 'For listening to very tiny music.'] },
  plant: { room: 'library', lines: ['A big leafy plant!', 'Plants like stories too. They just listen very slowly.'] },
  globe: { room: 'library', lines: ['A globe! The whole world, but small.', 'Greg likes to spin it and point. He has been to zero places.'] },
  mobile: { room: 'library', lines: ['A star mobile! It spins.', 'For when you want stars indoors.'] },
  telescope: { room: 'library', lines: ['A telescope! For looking at far-away things.', 'Like the moon. Or the kitchen.'] },
  portrait: { room: 'library', lines: ['A portrait of you!', 'So we can see you even when you are reading.'] },
  cushions: { room: 'library', lines: ['A pile of cushions!', 'For sitting. Or for building a very soft fort.'] },
  rug: { room: 'studio', lines: ['A rainbow rug!', 'Now even the floor is art.'] },
  sunflower: { room: 'studio', lines: ['A sunflower!', 'It is taller than Dot. Dot is not happy about it.'] },
  stars: { room: 'studio', lines: ['A string of paper stars!', 'Dot cut out every single one. It took her all week.'] },
  beret: { room: 'studio', lines: ['A beret! A real artist hat.', 'Dot has wanted one for 400 years.'] },
  crayons: { room: 'studio', lines: ['A giant jar of crayons!', 'Every color. Even the weird ones.'] },
  duck: { room: 'bath', lines: ['A rubber duck!', 'Bubbles named it Captain Quack.'] },
  bubbles: { room: 'bath', lines: ['Bubble bath!', 'The tub is full of bubbles now. Bubbles is very proud.'] },
  bathrug: { room: 'bath', lines: ['A fluffy bath mat!', 'For warm feet. Sparkees have very small feet.'] },
  nightlight: { room: 'bath', lines: ['A star nightlight!', 'For brushing your teeth in the dark.'] },
  fern: { room: 'bath', lines: ['A fern!', 'Ferns love bathrooms. It is a fern fact.'] },
};
const ROOM_POOL = (room) => Object.keys(ITEMS).filter((k) => ITEMS[k].room === room);
