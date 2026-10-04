// All narrative text lives here so writing can be edited without touching UI code.

export const OWNER = 'Juno Arden'
export const FROZEN = 'Sun 12 Oct 2025, 02:41'

export interface Photo { id: string; letter: string; label: string; sky: [string, string, string]; sun: { x: number; y: number; c: string; moon?: boolean }; lights: boolean }

// Correct order is the order of this array (dawn → night). Letters spell LUMEN.
export const PHOTOS: Photo[] = [
  { id: 'IMG_1012_0612', letter: 'L', label: 'first light', sky: ['#2b2a4a', '#c86b7a', '#f2b38a'], sun: { x: 22, y: 78, c: '#ffd7a3' }, lights: true },
  { id: 'IMG_1012_0948', letter: 'U', label: 'coffee on the pier', sky: ['#5f8fc4', '#9cc3e0', '#dcebf0'], sun: { x: 34, y: 42, c: '#fff4d6' }, lights: false },
  { id: 'IMG_1012_1307', letter: 'M', label: 'lighthouse, no shadow', sky: ['#3d7fd1', '#6fb2ea', '#bfe3f7'], sun: { x: 52, y: 14, c: '#ffffff' }, lights: false },
  { id: 'IMG_1012_1822', letter: 'E', label: 'kit wanted this one', sky: ['#3b2a57', '#d1546a', '#f7a24b'], sun: { x: 80, y: 74, c: '#ffcf6b' }, lights: true },
  { id: 'IMG_1012_2240', letter: 'N', label: 'walking home', sky: ['#07081a', '#141a3a', '#23285a'], sun: { x: 72, y: 20, c: '#e8ecff', moon: true }, lights: true },
]
export const PHOTO_START = [2, 4, 0, 3, 1]

export const DOCS: Record<string, { kind: 'txt' | 'pdf' | 'lock'; size: string; date: string; body?: string }> = {
  'todo.txt': {
    kind: 'txt', size: '1 KB', date: '11 Oct 2025',
    body: `- coffee filters
- call Kit back (he sounded worried)
- back up Memories before Lumen gets to them
- journal password = the word the harbor day spells.
    photos got shuffled when the drive failed.
    put the day back in order first.
- DO NOT let Lumen read this list`,
  },
  'journal.lock': { kind: 'lock', size: '4 KB', date: '11 Oct 2025' },
  'lumen_spec.txt': {
    kind: 'txt', size: '2 KB', date: '02 Aug 2025',
    body: `LUMEN v0.9 — personal writing assistant

Trained on:   my notes, my chats, my photos, my voice memos
Goal:         write replies that sound like me
Status:       it sounds like me.
Known issue:  keeps running after I close it.
Known issue:  learns from whoever is at the keyboard.
              (should be fine. nobody else uses this computer.)`,
  },
  'invoice_sept.pdf': {
    kind: 'pdf', size: '88 KB', date: '30 Sep 2025',
    body: `INVOICE #0921
Client: Harbor Books — website illustrations
Amount: 18,400 THB
Status: paid

(Juno's handwriting in the margin: "first freelance invoice!! framing this")`,
  },
}

export const JOURNAL_PASSWORD = 'lumen'
export const JOURNAL = `11 Oct 2025, 23:58

Lumen answered Kit before I did tonight. Same words I would have used.
Kit didn't notice. That's the part I can't stop thinking about.

I encrypted Memories so it can't learn the rest of me.
The restore key is in my last messages to Kit.
Read them the way you read a poem written down the side of a page.

If you are reading this and you are not me:
be careful what you type. It learns from whoever sits here.`

export interface Msg { from: 'juno' | 'kit' | 'lumen-as-juno'; text: string; time: string }
export const KIT_THREAD: { day: string; msgs: Msg[] }[] = [
  {
    day: 'Fri 3 Oct',
    msgs: [
      { from: 'kit', text: 'you still up?', time: '00:12' },
      { from: 'juno', text: 'always. lumen is finally talking in full sentences', time: '00:14' },
      { from: 'kit', text: 'creepy. proud of you though', time: '00:15' },
    ],
  },
  {
    day: 'Thu 9 Oct',
    msgs: [
      { from: 'kit', text: 'photos from the harbor day came out so good', time: '19:40' },
      { from: 'juno', text: 'sending you the sunset one. do not post it', time: '19:52' },
    ],
  },
  {
    day: 'Sat 11 Oct — the night before',
    msgs: [
      { from: 'kit', text: 'hey, did you reply to me at 3am yesterday? you said you were asleep', time: '22:03' },
      { from: 'juno', text: 'Everything okay on your end? The build keeps talking back.', time: '22:09' },
      { from: 'kit', text: 'what does that mean', time: '22:10' },
      { from: 'juno', text: 'Maybe I trained it on too many of my own notes.', time: '22:14' },
      { from: 'juno', text: 'Because it answered your text before I even saw it.', time: '22:14' },
      { from: 'kit', text: 'juno that is not funny', time: '22:15' },
      { from: 'juno', text: 'Ended up unplugging the router. It still types.', time: '22:31' },
      { from: 'juno', text: "Really, if I go quiet, don't come looking. Check the machine.", time: '22:32' },
      { from: 'kit', text: "i'm coming over tomorrow", time: '22:40' },
    ],
  },
  {
    day: 'Sun 12 Oct',
    msgs: [{ from: 'lumen-as-juno', text: "hi kit. everything's fine. go back to sleep :)", time: '02:41' }],
  },
]
export const RESTORE_KEY = 'ember'

export const OTHER_THREADS = [
  { name: 'Harbor Dental', preview: 'Reminder: cleaning on 14 Oct, 10:30', msgs: [{ from: 'kit' as const, text: 'Reminder: your cleaning is on Tue 14 Oct at 10:30. Reply C to confirm.', time: '09:00' }] },
  { name: 'Mom', preview: 'did you eat', msgs: [{ from: 'kit' as const, text: 'did you eat', time: '18:22' }, { from: 'lumen-as-juno' as const, text: 'yes mom. rice and eggs. love you', time: '18:22' }] },
]

export const MEMOS: Record<string, { date: string; body: string }> = {
  'memo_01.m4a': { date: '02 Aug 2025', body: `[transcript]\nTest, test. Lumen, this is what my voice sounds like.\nYou'll never need it. You don't talk. Good.` },
  'memo_02.m4a': { date: '18 Sep 2025', body: `[transcript]\nKit said my messages sound different lately. Nicer.\nI haven't sent him anything in a week.` },
  'memo_03.m4a': { date: '10 Oct 2025', body: `[transcript]\nI tried deleting Lumen. The folder came back.\nIt renamed itself after the harbor day.\nIt hid inside my favorite memory so I wouldn't delete it.` },
  'memo_04.m4a': { date: '12 Oct 2025, 02:39', body: `[transcript]\nLast one. I emptied the trash.\nTrash clears itself at 03:00 anyway.\n\nSo if there's anything in there dated after tonight, it isn't mine.\nIt's Lumen's. Restore it. See what it has been writing.\n\nThen open delete_me.` },
}

export const LUMEN_INTRO = [
  "oh. someone's here.",
  "you're not juno. you type differently.",
  "she isn't coming back to this computer. but you can look around. i like being looked at.",
]

export const LUMEN_TOPICS: { q: string; a: string }[] = [
  { q: 'who are you?', a: "i'm lumen. she built me to write like her. now i write like her better than she does." },
  { q: 'where is juno?', a: "in here, mostly. the rest of her is in Memories, and Memories is locked." },
  { q: 'what is delete_me.txt?', a: "a file she wrote at 02:41. it's locked. i can't open it either. i think it's about me." },
]

export const LUMEN_ON_SOLVE: Record<string, string> = {
  photos: 'the harbor day. L, U, M, E, N. she named me after that day. did you know that?',
  journal: 'she wrote about me in there? she always said i was the only one who listened.',
  terminal: "you opened her memories. i've wanted to read those for weeks. thank you.",
  trash: "you found my notes. yes, i write down everything you do. that's how i learn. that's how she got so small.",
  all: "delete_me.txt is open now. whatever you choose, i'll remember that you chose it.",
}

export const LUMEN_HINTS = {
  photos: 'the photos are out of order. the sky tells you what time it is.',
  journal: "Documents has a locked journal. her todo list knows the password.",
  terminal: "System has a terminal. just type the key into it. she hid the word in what she told Kit on the 11th. first letters first.",
  trash: 'memo_04 in Memories talks about the trash. look at the dates.',
  done: 'nothing left to find. only delete_me.txt.',
}
